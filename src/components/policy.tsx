import React, { useEffect, useState, ReactNode, useContext } from "react";
import { query_jsonld, Sources } from "../query/query";
import { graph_to_ul } from "../query/display_pad";
import { pad_id_norm } from "../query/pad";
import { fold_graph } from "../query/fold";
import { AppContext, PadContext } from "../context";
import { QueryEngine } from "@comunica/query-sparql-rdfjs";

const publicationPolicyTypes = [
    "ppo:PublicationPolicy"
]
const elsewherePolicyTypes = [
    "ppo:PublicationElsewherePolicy",
    "ppo:PublicationElsewhereAllowedPolicy",
    "ppo:PublicationElsewhereProhibitedPolicy",
    "ppo:PublicationElsewhereAllowed",
    "ppo:PublicationElsewhereProhibited"
]
const evaluationPolicyTypes = [
    "ppo:EvaluationPolicy"
]

type PolicyComponentProps = { pad_id: string };
function PolicyComponent({ pad_id }: PolicyComponentProps) {
    pad_id = pad_id_norm(pad_id);
    // const sparqlEngine = useContext(AppContext).sparqlEngine
    const sparqlEngine = new QueryEngine()
    const padStore = useContext(PadContext)
    const [queryResult, setQueryResult] = useState([]);
    const [publicationPolicies, setPublicationPolicies] = useState([]);
    const [evaluationPolicies, setEvaluationPolicies] = useState([]);
    const [elsewherePolicies, setElsewherePolicies] = useState([]);

    useEffect(() => {
        const render = async () => {
            console.log("start")
            console.log(padStore.size)
            const result = await pad_policy(pad_id, sparqlEngine, [padStore])
            console.log(result)
            setQueryResult(fold_graph(result, 2))
        }
        (pad_id && padStore) ? render() : null
    }, [pad_id, padStore]);

    useEffect(() => {
        async function render() {
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

type PolicySectionProps = {
    title: string;
    children: Array<ReactNode> | ReactNode;
};
const PolicySection = ({ title, children }: PolicySectionProps) =>
    children ? (
        <div className="subsection">
            <h2>{title}</h2>
            {children}
        </div>
    ) : null;

async function pad_policy(pad_id: string, engine: QueryEngine, sources: Sources) {
    const query = `
        construct {
            ?policy ?p1 ?o1 .
            ?o1 ?p2 ?o2 .
            ?policy ppo:_src ?source .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform ;
                    ppo:hasPolicy ?policy .
                optional { ?policy ?p1 ?o1 } .
                optional { ?o1 ?p2 ?o2 } .
            }
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ppo:hasPolicy ?policy } .
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, engine, sources);
}

export default PolicyComponent;
