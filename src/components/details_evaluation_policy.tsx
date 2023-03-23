import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../context";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { ld_cons_src, ld_to_str, zip_prop } from "../query/ld";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { PolicyDetailsItem } from "./details_policy";
import * as summary from "./details_policy_summary"
import summarize from "./details_policy_summary"

export const PlatformEvaluationPolicies = () => {
    const padStore = useContext(PadContext)
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_evaluation_policies(padStore)
            const fold = fold_graph(result, 1).filter(g => (g["@type"] || []).includes("ppo:EvaluationPolicy"))
            setPolicies(ld_cons_src(fold))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);

    return (
        <DetailsCard title="Evaluation Policies" loading={loading}>
            {policies.map(([p, s]) => (
                <PlatformEvaluationPolicy key={p["@id"]} policy={p} src={s} />
            ))}
        </DetailsCard>
    )
}

const PlatformEvaluationPolicy = ({policy, src}: {policy: object, src: string[]}) => {
    const zip = zip_prop(policy)
    const involves = policy["ppo:involves"] || []
    const authors = involves.filter((p: object) => p["@type"] == "pro:author")
    const reviewers = involves.filter((p: object) => p["@type"] == "pro:peer-reviewer")
    const editors = involves.filter((p: object) => p["@type"] == "pro:editor")
    console.log(isblind(authors, reviewers))


    return (
        <SourceWrapper key={policy["@id"]} src={src}>
            <PolicyDetailsItem 
                id={policy["@id"]}
                items={[
                ]}
                summary={[
                ]}
            />
        </SourceWrapper>
    )
}

async function platform_evaluation_policies(store: Quadstore) {
    const query = `
        construct {
            ?policy a ppo:EvaluationPolicy .
            ?policy ppo:_src ?source .
        ?policy ppo:involves ?person .
        
        ?person a ?persontype .
        ?person ppo:identityPubliclyAccessible ?personpublic .
        ?person ppo:anonymousTo ?otherpersonanon .
        ?person ppo:identifiedTo ?otherpersonid .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform ; ppo:hasPolicy ?policy .
                ?policy a ppo:EvaluationPolicy .
                optional { ?policy ppo:involves ?person . ?person a ?persontype } .
                optional { ?person ppo:identityPubliclyAccessible ?personpublic } .
                optional { ?person ppo:anonymousTo [ a ?otherpersonanon] } .
                optional { ?person ppo:identifiedTo [ a ?otherpersonid ] } .
                optional { ?policy ppo:covers ?document . ?document a ?documenttype } .
                optional { ?document ppo:workPubliclyAccessible ?documentpublic } .
            }
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ppo:hasPolicy ?policy } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}


const isblind = (authors: object[], reviewers: object[]) => {
    const anonymous = (persons: object[], type: string) => {
        if (persons.length == 0) { return false }
        const anonymous = persons.every(a => (a["ppo:anonymousTo"] || []).map(ld_to_str).includes(type))
        const identified = persons.every(a => (a["ppo:identifiedTo"] || []).map(ld_to_str).includes(type))
        return (anonymous && !identified)
    }
    const author_reviewer = anonymous(authors, "pro:peer-reviewer")
    const reviewer_author = anonymous(reviewers, "pro:author")
    const author_editor = anonymous(authors, "pro:editor")
    const reviewer_editor = anonymous(reviewers, "pro:editor")
    if (reviewer_author && author_reviewer && author_editor && reviewer_editor) {return "triple"}
    if (reviewer_author && author_reviewer) {return "double"}
    if (reviewer_author) {return "single"}
    if (!reviewer_author && !author_reviewer && !author_editor && !reviewer_editor) {return "all"}
    return "other"
}
