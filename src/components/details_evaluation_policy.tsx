import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { ld_cons_src, ld_contains, ld_to_str } from "../query/jsonld_helpers";
import { DetailsCard, SourceWrapper } from "./details";
import { fold_graph } from "../query/fold";
import { PolicyDetailsItem, PolicyItem } from "./details_policy";
import * as summary from "./details_policy_summary"
import { AnnotationDialog } from "./info";
import info from "../strings/info.json";

export const PlatformEvaluationPolicies = ({ expanded }: { expanded?: boolean }) => {
    const padStore = useContext(PadContext)
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_evaluation_policies(padStore)
            const fold = fold_graph(result, 1).filter(g => (g["@type"] || []).includes("scpo:EvaluationPolicy"))
            setPolicies(ld_cons_src(fold))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);

    return (
        <DetailsCard
            title="Evaluation policies"
            loading={loading}
            infodialog={<AnnotationDialog property="evaluation-policies-title" text={info["evaluation-policies-text"]} />}
            defaultExpanded={expanded}
        >
            {policies.map(([p, s]) => (
                <PlatformEvaluationPolicy key={p["@id"]} policy={p} src={s} />
            ))}
        </DetailsCard>
    )
}

const PlatformEvaluationPolicy = ({policy, src}: {policy: object, src: string[]}) => {
    const id = ld_to_str(policy["@id"])
    const people = policy["scpo:involves"] || []
    const documents = policy["scpo:covers"] || []
    const commenting = policy["scpo:hasPostPublicationCommenting"]

    const authors = people.filter((p: object) => p["@type"] == "pro:author")
    const authors_id = accessible(id, "Author identity", authors)
    const reviewers = people.filter((p: object) => p["@type"] == "pro:peer-reviewer")
    const reviewers_id = accessible(id, "Reviewer identity", reviewers)
    const reviewer_interacts = interacts(id, "Reviewer interacts with", reviewers)
    const editors = people.filter((p: object) => p["@type"] == "pro:editor")
    const editors_id = accessible(id, "Editor identity", editors)
    const people_id = [authors_id, reviewers_id, editors_id]
        .filter(Boolean)
        .map(summary.accessible)
    const anonymized = summary.anonymized(is_anonymized(id, authors, reviewers))

    const reports = documents.filter((p: object) => p["@type"] == "scpo:ReviewReport")
    const report_id = accessible(id, "scpo:ReviewReport", reports)
    const summaries = documents.filter((p: object) => p["@type"] == "scpo:ReviewSummary")
    const summary_id = accessible(id, "scpo:ReviewSummary", summaries)
    const manuscripts = documents.filter((p: object) => p["@type"] == "scpo:SubmittedManuscript")
    const manuscript_id = accessible(id, "scpo:SubmittedManuscript", manuscripts)
    const communication = documents.filter((p: object) => p["@type"] == "scpo:AuthorEditorCommunication")
    const communication_id = accessible(id, "scpo:AuthorEditorCommunication", communication)
    const documents_id = [report_id, summary_id, manuscript_id, communication_id]
        .filter(Boolean)
        .map(summary.accessible)

    const commenting_id = ppc(id, commenting)
        .map(summary.ppc)

    if (people_id.length == 0) {
        people_id.push(summary.no_accessible(id, "No identities published"))
    }
    if (documents_id.length == 0) {
        people_id.push(summary.no_accessible(id, "No review documents published"))
    }

    return (
        <SourceWrapper key={policy["@id"]} src={src}>
            <PolicyDetailsItem 
                id={policy["@id"]}
                items={[
                    anonymized,
                    ...people_id,
                    ...documents_id,
                    ...commenting_id,
                    ...reviewer_interacts
                ]}
            />
        </SourceWrapper>
    )
}

async function platform_evaluation_policies(store: Quadstore) {
    const query = `
        construct {
            ?policy a scpo:EvaluationPolicy .
            ?policy scpo:_src ?source .
            ?policy scpo:involves ?person .
            ?policy scpo:covers ?document .
            ?policy scpo:hasPostPublicationCommenting ?ppc .

            ?person a ?persontype .
            ?person scpo:publiclyAccessible ?personpublic .
            ?person scpo:anonymousTo ?otherpersonanon .
            ?person scpo:identifiedTo ?otherpersonid .
            ?person scpo:interactsWith ?interacts .

            ?document a ?documenttype .
            ?document scpo:publiclyAccessible ?documentpublic .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a scpo:Platform ; scpo:hasPolicy ?policy .
                ?policy a scpo:EvaluationPolicy .
                optional { ?policy scpo:involves ?person . ?person a ?persontype } .
                optional { ?person scpo:identityPubliclyAccessible ?personpublic } .
                optional { ?person scpo:anonymousTo [ a ?otherpersonanon ] } .
                optional { ?person scpo:identifiedTo [ a ?otherpersonid ] } .
                optional { ?person scpo:interactsWith [ a ?interacts ] } .
                optional { ?policy scpo:covers ?document . ?document a ?documenttype } .
                optional { ?policy scpo:hasPostPublicationCommenting ?ppc . } .
                optional { ?document scpo:workPubliclyAccessible ?documentpublic } .
            }
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a scpo:Platform ; scpo:hasPolicy ?policy } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}


const is_anonymized = (id: string, authors: object[], reviewers: object[]): PolicyItem => {
    const item: PolicyItem = {id: id, type: "Anonymized"}
    const anonymous = (persons: object[], type: string) => {
        if (persons.length == 0) { return false }
        const anonymous = persons.every(ld_contains("scpo:anonymousTo", type))
        const identified = persons.some(ld_contains("scpo:identifiedTo", type))
        return (anonymous && !identified)
    }
    const author_reviewer = anonymous(authors, "pro:peer-reviewer")
    const reviewer_author = anonymous(reviewers, "pro:author")
    const author_editor = anonymous(authors, "pro:editor")
    const reviewer_editor = anonymous(reviewers, "pro:editor")
    if (reviewer_author && author_reviewer && author_editor && reviewer_editor) {
        item.value = "Triple"
    }
    if (reviewer_author && author_reviewer) {
        item.value = "Double"
    }
    if (reviewer_author) {
        item.value = "Single"
    }
    if (!reviewer_author && !author_reviewer && !author_editor && !reviewer_editor) {
        item.value = "All Identities Visible"
    }
    return item.value ? item : null
}

const accessible = (id: string, type: string, obj: object[]): PolicyItem => {
    if (obj.length == 0) { return null }
    const item: PolicyItem = {id: id, type: type}
    if (obj.some(ld_contains("scpo:publiclyAccessible", "scpo:Accessible"))) {
        item.value = "scpo:Accessible"
    }
    if (obj.every(ld_contains("scpo:publiclyAccessible", "scpo:NotAccessible"))) {
        item.value = "scpo:NotAccessible"
    }
    if (obj.some(ld_contains("scpo:publiclyAccessible", "scpo:OptIn"))) {
        item.value = "scpo:OptIn"
    }
    return item.value ? item : null
}

const ppc = (id: string, obj: object[]): PolicyItem[] => {
    const item: PolicyItem = {id: id, type: "scpo:hasPostPublicationCommenting"}
    return obj.map(o => ({...item, value: ld_to_str(o["@id"])})).filter(item => item.value)
}

const interacts = (id: string, type: string, obj: object[]): PolicyItem[] => {
    const item: PolicyItem = {id: id, type: type}
    const interactions = obj.map(o => (o["scpo:interactsWith"] || []).map(ld_to_str))
    return interactions.flat().map(i => ({...item, value: i}))
}
