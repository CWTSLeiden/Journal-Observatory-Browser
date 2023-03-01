import React, { useEffect, useState, ReactNode, useContext } from "react";
import { query_jsonld } from "../query/local";
import { pad_id_norm, graph_to_ul } from "../query/display_pad";
import { fold_graph } from "../query/fold";
import { PadContext } from "../context";
import { Quadstore } from "quadstore";

const publicationPolicyTypes = [
    "ppo:PublicationPolicy"
]
const elsewherePolicyTypes = [
    "ppo:PublicationElsewherePolicy",
    "ppo:PublicationElsewhereAllowedPolicy",
    "ppo:PublicationElsewhereProhibitedPolicy",
    "ppo:PublicationElsewhereMandatoryPolicy"
]
const evaluationPolicyTypes = [
    "ppo:EvaluationPolicy"
]

type PolicyComponentProps = { pad_id: string };
function PolicyComponent({ pad_id }: PolicyComponentProps) {
    pad_id = pad_id_norm(pad_id);
    const padStore = useContext(PadContext)
    const [publicationPolicies, setPublicationPolicies] = useState([]);
    const [evaluationPolicies, setEvaluationPolicies] = useState([]);
    const [elsewherePolicies, setElsewherePolicies] = useState([]);

    useEffect(() => {
        const render = async () => {
            const result = await pad_publication_policy(pad_id, padStore)
            const fold = fold_graph(result, 2)
            const filter = (g : object) => publicationPolicyTypes.includes(g["@type"])
            setPublicationPolicies(fold.filter(filter))
        }
        (pad_id && padStore) ? render() : null
    }, [pad_id, padStore]);

    useEffect(() => {
        const render = async () => {
            const result = await pad_elsewhere_policy(pad_id, padStore)
            const fold = fold_graph(result, 2)
            console.log(fold)
            const filter = (g : object) =>  elsewherePolicyTypes.includes(g["@type"])
            setElsewherePolicies(fold.filter(filter))
        }
        (pad_id && padStore) ? render() : null
    }, [pad_id, padStore]);

    useEffect(() => {
        const render = async () => {
            const result = await pad_evaluation_policy(pad_id, padStore)
            const fold = fold_graph(result, 2)
            const filter = (g : object) => evaluationPolicyTypes.includes(g["@type"])
            setEvaluationPolicies(fold.filter(filter))
        }
        (pad_id && padStore) ? render() : null
    }, [pad_id, padStore]);

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

async function pad_publication_policy(pad_id: string, store: Quadstore) {
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
                ?policy a ppo:PublicationPolicy .
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
    return await query_jsonld(query, store);
}

async function pad_elsewhere_policy(pad_id: string, store: Quadstore) {
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
                ?policy a ?elsewherepolicy .
                optional { ?policy ?p1 ?o1 } .
                optional { ?o1 ?p2 ?o2 } .
            }
            ?elsewherepolicy rdfs:subClassOf ppo:PublicationElsewherePolicy .
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ppo:hasPolicy ?policy } .
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, store);
}

async function pad_evaluation_policy(pad_id: string, store: Quadstore) {
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
                ?policy a ppo:EvaluationPolicy .
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
    return await query_jsonld(query, store);
}

export default PolicyComponent;
