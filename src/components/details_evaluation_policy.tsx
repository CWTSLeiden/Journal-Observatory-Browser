import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { ld_cons_src, ld_contains, ld_to_str } from "../query/ld";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { Item, PolicyDetailsItem } from "./details_policy";
import * as summary from "./details_policy_summary"

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
    const people = policy["ppo:involves"] || []
    const documents = policy["ppo:covers"] || []

    const authors = people.filter((p: object) => p["@type"] == "pro:author")
    const authors_id = accessible(authors, "Author identity")
    const reviewers = people.filter((p: object) => p["@type"] == "pro:peer-reviewer")
    const reviewers_id = accessible(reviewers, "Reviewer identity")
    const reviewer_interacts = interacts(reviewers, "Reviewer interacts with")
    const editors = people.filter((p: object) => p["@type"] == "pro:editor")
    const editors_id = accessible(editors, "Editor identity")
    const people_id = [authors_id, reviewers_id, editors_id].filter(Boolean)
    console.log(people_id)
    const anonymized = is_anonymized(authors, reviewers)

    const reports = documents.filter((p: object) => p["@type"] == "ppo:ReviewReport")
    const report_id = accessible(reports, "ppo:ReviewReport")
    const summaries = documents.filter((p: object) => p["@type"] == "ppo:ReviewSummary")
    const summary_id = accessible(summaries, "ppo:ReviewSummary")
    const manuscripts = documents.filter((p: object) => p["@type"] == "ppo:SubmittedManuscript")
    const manuscript_id = accessible(manuscripts, "ppo:SubmittedManuscript")
    const communication = documents.filter((p: object) => p["@type"] == "ppo:AuthorEditorCommunication")
    const communication_id = accessible(communication, "ppo:AuthorEditorCommunication")
    const documents_id = [report_id, summary_id, manuscript_id, communication_id].filter(Boolean)

    const commenting = documents.filter((p: object) => p["@type"] == "ppo:postPublicationCommenting")
    const commenting_id = ppc(commenting)

    const anonymized_summary = summary.anonymized(anonymized ? anonymized[1] : null)
    const people_id_summary = people_id.map(summary.accessible).filter(Boolean)
    const documents_id_summary = documents_id.map(summary.accessible).filter(Boolean)
    if (people_id_summary.length == 0) {
        documents_id_summary.push(summary.no_accessible("No Identities Published"))
    }
    if (documents_id_summary.length == 0) {
        documents_id_summary.push(summary.no_accessible("No Review Documents Published"))
    }

    return (
        <SourceWrapper key={policy["@id"]} src={src}>
            <PolicyDetailsItem 
                id={policy["@id"]}
                items={[
                    anonymized,
                    authors_id,
                    reviewers_id,
                    editors_id,
                    report_id,
                    summary_id,
                    manuscript_id,
                    communication_id,
                    ...commenting_id,
                    ...reviewer_interacts
                ]}
                summary={[
                    anonymized_summary,
                    ...people_id_summary,
                    ...documents_id_summary,
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
            ?policy ppo:covers ?document .

            ?person a ?persontype .
            ?person ppo:publiclyAccessible ?personpublic .
            ?person ppo:anonymousTo ?otherpersonanon .
            ?person ppo:identifiedTo ?otherpersonid .
            ?person ppo:interactsWith ?interacts .

            ?document a ?documenttype .
            ?document ppo:publiclyAccessible ?documentpublic .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform ; ppo:hasPolicy ?policy .
                ?policy a ppo:EvaluationPolicy .
                optional { ?policy ppo:involves ?person . ?person a ?persontype } .
                optional { ?person ppo:identityPubliclyAccessible ?personpublic } .
                optional { ?person ppo:anonymousTo [ a ?otherpersonanon ] } .
                optional { ?person ppo:identifiedTo [ a ?otherpersonid ] } .
                optional { ?person ppo:interactsWith [ a ?interacts ] } .
                optional { ?policy ppo:covers ?document . ?document a ?documenttype } .
                optional { ?document ppo:publiclyAccessible ?documentpublic } .
            }
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ppo:hasPolicy ?policy } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}


const is_anonymized = (authors: object[], reviewers: object[]): Item => {
    const label = "Anonymized"
    const anonymous = (persons: object[], type: string) => {
        if (persons.length == 0) { return false }
        const anonymous = persons.every(ld_contains("ppo:anonymousTo", type))
        const identified = persons.some(ld_contains("ppo:identifiedTo", type))
        return (anonymous && !identified)
    }
    const author_reviewer = anonymous(authors, "pro:peer-reviewer")
    const reviewer_author = anonymous(reviewers, "pro:author")
    const author_editor = anonymous(authors, "pro:editor")
    const reviewer_editor = anonymous(reviewers, "pro:editor")
    if (reviewer_author && author_reviewer && author_editor && reviewer_editor) {
        return [label, "Triple"]
    }
    if (reviewer_author && author_reviewer) {
        return [label, "Double"]
    }
    if (reviewer_author) {
        return [label, "Single"]
    }
    if (!reviewer_author && !author_reviewer && !author_editor && !reviewer_editor) {
        return [label, "All Identities Visible"]
    }
    return null
}

const accessible = (obj: object[], label: string): Item => {
    if (obj.length == 0) { return null }
    if (obj.some(ld_contains("ppo:publiclyAccessible", "ppo:Accessible"))) {
        return [label, "ppo:Accessible"]
    }
    if (obj.every(ld_contains("ppo:publiclyAccessible", "ppo:NotAccessible"))) {
        return [label, "ppo:NotAccessible"]
    }
    if (obj.some(ld_contains("ppo:publiclyAccessible", "ppo:OptIn"))) {
        return [label, "ppo:OptIn"]
    }
    return null
}

const ppc = (obj: object[]): Item[] => {
    const label = "Commenting"
    return obj.map(o => ([label, ld_to_str(o["@id"])] as Item)).filter(([,id]) => id)
}

const interacts = (obj: object[], label: string): Item[] => {
    const interactions = obj.map(o => (o["ppo:interactsWith"] || []).map(ld_to_str))
    return interactions.flat().map(i => [label, i] as Item)
}
