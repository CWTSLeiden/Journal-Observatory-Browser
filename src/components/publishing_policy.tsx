import React, { useEffect, useState, ReactNode } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { query_jsonld } from "../query/query";
import { graph_to_ul, pgraph_to_ul } from "../query/display_pad";
import { pad_id_norm } from "../query/pad";
import { fold_graph } from "../query/fold";

type PubPolicyComponentProps = { pad_id: string };
function PubPolicyComponent({ pad_id }: PubPolicyComponentProps) {
    pad_id = pad_id_norm(pad_id);
    const [queryResult, setQueryResult] = useState(undefined);
    const [policies, setPolicies] = useState([]);
    const sparqlEngine = new QueryEngine();

    useEffect(() => {
        async function render() {
            setQueryResult(await pad_pubpolicy(pad_id, sparqlEngine))
        }
        render();
    }, [pad_id]);

    useEffect(() => {
        async function render() {
            const fold = fold_graph(queryResult || [])
            const filter = fold.filter(g => g["@type"] == "ppo:PublicationPolicy")
            setPolicies(filter)
        }
        render();
    }, [queryResult]);

    return (
        <section id="metadata">
            <h1>PubPolicy</h1>
            <PubPolicySection title={"PubPolicies"}>
                {graph_to_ul(policies)}
            </PubPolicySection>
        </section>
    );
}

type PubPolicySectionProps = {
    title: string;
    children: Array<ReactNode> | ReactNode;
};
const PubPolicySection = ({ title, children }: PubPolicySectionProps) =>
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
            ?policy ppo:_src ?g .
        }
        where { 
            ?pad pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform ;
                        ppo:hasPolicy ?policy .
                ?policy a ppo:PublicationPolicy .
                optional { ?policy ?p1 ?o1 } .
                optional { ?o1 ?p2 ?o2 } .
                optional { ?o2 ?p3 ?o3 } .
            }
            optional {
                graph ?g { ?platform a ppo:Platform ; ppo:hasPolicy ?policy } .
                ?g dcterms:creator ?creator
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, engine);
}

export default PubPolicyComponent;
