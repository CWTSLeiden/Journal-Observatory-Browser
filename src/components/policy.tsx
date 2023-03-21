import React, { useEffect, useState, ReactNode, useContext } from "react";
import { query_jsonld } from "../query/local";
import { graph_to_ul } from "../query/display_pad";
import { fold_graph } from "../query/fold";
import { PadContext } from "../context";
import { Quadstore } from "quadstore";
import { pad_id_norm } from "../query/ld";

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
