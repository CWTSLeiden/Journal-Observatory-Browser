import React, { useEffect, useState, ReactNode } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { query_jsonld } from "../query/query";
import { graph_to_ul } from "../query/display_pad";
import { pad_id_norm } from "../query/pad";
import { fold_graph } from "../query/fold";

const publicationPolicyTypes = [
    "ppo:PublicationPolicy"
]
const elsewherePolicyTypes = [
    "ppo:PublicationElsewherePolicy",
    "ppo:PublicationElsewhereAllowedPolicy",
    "ppo:PublicationElsewhereProhibitedPolicy"
]
const evaluationPolicyTypes = [
    "ppo:EvaluationPolicy"
]

type PubPolicyComponentProps = { pad_id: string };
function PubPolicyComponent({ pad_id }: PubPolicyComponentProps) {
    pad_id = pad_id_norm(pad_id);
    const [queryResult, setQueryResult] = useState([]);
    const [publicationPolicies, setPublicationPolicies] = useState([]);
    const [evaluationPolicies, setEvaluationPolicies] = useState([]);
    const [elsewherePolicies, setElsewherePolicies] = useState([]);
    const sparqlEngine = new QueryEngine();

    useEffect(() => {
        async function render() {
            const result = await pad_pubpolicy(pad_id, sparqlEngine)
            setQueryResult(fold_graph(result, 2))
        }
        render();
    }, [pad_id]);

    useEffect(() => {
        async function render() {
            console.log(queryResult)
            const pubPolicyFilter = (g : object) => publicationPolicyTypes.includes(g["@type"])
            const evalPolicyFilter = (g : object) => evaluationPolicyTypes.includes(g["@type"])
            const elsePolicyFilter = (g : object) =>  elsewherePolicyTypes.includes(g["@type"])
            setPublicationPolicies(queryResult.filter(pubPolicyFilter))
            setEvaluationPolicies(queryResult.filter(evalPolicyFilter))
            setElsewherePolicies(queryResult.filter(elsePolicyFilter))
        }
        render();
    }, [queryResult]);

    return (
        <section id="metadata">
            <h1>Policies</h1>
            <PolicySection title={"Publication Policies"}>
                {graph_to_ul(publicationPolicies)}
            </PolicySection>
            <PolicySection title={"Publication Elsewhere Policies"}>
                {graph_to_ul(elsewherePolicies)}
            </PolicySection>
            <PolicySection title={"Evaluation Policies"}>
                {graph_to_ul(evaluationPolicies)}
            </PolicySection>
        </section>
    );
}

type PubPolicySectionProps = {
    title: string;
    children: Array<ReactNode> | ReactNode;
};
const PolicySection = ({ title, children }: PubPolicySectionProps) =>
    children ? (
        <div className="subsection">
            <h2>{title}</h2>
            {children}
        </div>
    ) : null;

async function pad_pubpolicy(pad_id: string, engine: QueryEngine) {
    const query = `
        construct {
            ?policy ?p1 ?o1 .
            ?o1 ?p2 ?o2 .
            ?o2 ?p3 ?o3 .
            ?policy ppo:_src ?source .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform ;
                    ppo:hasPolicy ?policy .
                optional { ?policy ?p1 ?o1 } .
                optional { ?o1 ?p2 ?o2 } .
                optional { ?o2 ?p3 ?o3 } .
            }
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                service <repository:pad> {
                    graph ?source { [] a ppo:Platform ; ppo:hasPolicy ?policy } .
                }
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, engine);
}

export default PubPolicyComponent;
