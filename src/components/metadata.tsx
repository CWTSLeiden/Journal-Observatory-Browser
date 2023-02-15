import React, { useEffect, useState, ReactNode } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { query_jsonld } from "../query/query";
import { graph_to_ul, pgraph_to_ul } from "../query/display_pad";
import { pad_id_norm } from "../query/pad";

type MetadataComponentProps = { pad_id: string };
function MetadataComponent({ pad_id }: MetadataComponentProps) {
    pad_id = pad_id_norm(pad_id);
    const [meta, setMeta] = useState(undefined);
    const [meta_id, setMetaId] = useState(undefined);
    const [meta_org, setMetaOrg] = useState(undefined);
    const sparqlEngine = new QueryEngine();
    useEffect(() => {
        async function render() {
            setMeta(await pad_metadata(pad_id, sparqlEngine));
            setMetaId(await pad_metadata_identifiers(pad_id, sparqlEngine));
            setMetaOrg(await pad_metadata_organizations(pad_id, sparqlEngine));
        }
        render();
    }, [pad_id]);

    return (
        <section id="metadata">
            <h1>Metadata</h1>
            <MetadataSection title={"Names"}>
                {pgraph_to_ul(meta, "schema:name")}
            </MetadataSection>
            <MetadataSection title={"Urls"}>
                {pgraph_to_ul(meta, "schema:url")}
            </MetadataSection>
            <MetadataSection title={"Keywords"}>
                {pgraph_to_ul(meta, "ppo:hasKeyword")}
            </MetadataSection>
            <MetadataSection title={"Identifiers"}>
                {pgraph_to_ul(meta_id)}
            </MetadataSection>
            <MetadataSection title={"Organizations"}>
                {graph_to_ul(meta_org)}
            </MetadataSection>
        </section>
    );
}

type MetadataSectionProps = { title: string; children: ReactNode };
const MetadataSection = ({ title, children }: MetadataSectionProps) =>
    children ? (
        <div className="subsection">
            <h2>{title}</h2>
            {children}
        </div>
    ) : null;

async function pad_metadata(pad_id: string, engine: QueryEngine) {
    const query = `
        construct {
            ?b ?p ?o .
            ?b ppo:_src ?source .
        }
        where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion { ?s a ppo:Platform ; ?p ?o } .
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                service <repository:pad> {
                    graph ?source { [] a ppo:Platform ; ?p ?o } .
                }
            } .
            bind(bnode() as ?b)
            filter(?p in (schema:name, schema:url, ppo:hasKeyword))
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, engine);
}

async function pad_metadata_identifiers(pad_id: string, engine: QueryEngine) {
    const query = `
        construct {
            ?b ?p ?o .
            ?b ppo:_src ?source .
        }
        where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion { ?s a ppo:Platform ; ?p ?o } .
            { 
                select distinct ?b ?p ?o where {
                    ?p rdfs:subPropertyOf ?type.
                    filter(?type in (dcterms:identifier))
                    bind(bnode() as ?b)
                }
            }
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                service <repository:pad> {
                    graph ?source { [] a ppo:Platform ; ?p ?o } .
                }
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, engine);
}

async function pad_metadata_organizations(pad_id: string, engine: QueryEngine) {
    const query = `
        construct {
            ?org ?p ?o .
            ?org ppo:_src ?source .
        }
        where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform ; ppo:hasOrganization ?org .
                ?org ?p ?o .
            } .
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                service <repository:pad> {
                    graph ?source { [] a ppo:Platform ; ppo:hasOrganization ?org } .
                }
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, engine);
}

export default MetadataComponent;
