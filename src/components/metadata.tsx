import React, { useEffect, useState, ReactNode } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { query_jsonld } from "../query/query";
import { graph_to_ul, pgraph_to_ul } from "../query/display_pad";
import { pad_id_norm } from "../query/pad";


type MetadataComponentProps = { pad_id: string };
function MetadataComponent(props: MetadataComponentProps) {
    const pad_id = pad_id_norm(props.pad_id)
    const [meta, setMeta] = useState(undefined);
    const [meta_id, setMetaId] = useState(undefined);
    const [meta_org, setMetaOrg] = useState(undefined);
    const [names, setNames] = useState(undefined);
    const [urls, setUrls] = useState(undefined);
    const [keywords, setKeywords] = useState(undefined);
    const [identifiers, setIdentifiers] = useState(undefined);
    const [organizations, setOrganizations] = useState(undefined);
    const sparqlEngine = new QueryEngine();
    useEffect(() => {
        async function render() {
            if (pad_id) {
                setMeta(await pad_metadata(pad_id, sparqlEngine))
                setMetaId(await pad_metadata_identifiers(pad_id, sparqlEngine))
                setMetaOrg(await pad_metadata_organizations(pad_id, sparqlEngine))
            }
        }
        render();
    }, [pad_id]);

    useEffect(() => {
        setNames(pgraph_to_ul(meta, "schema:name"));
        setUrls(pgraph_to_ul(meta, "schema:url"));
        setKeywords(pgraph_to_ul(meta, "ppo:hasKeyword"));
    }, [meta]);

    useEffect(() => {
        setIdentifiers(pgraph_to_ul(meta_id));
    }, [meta_id]);

    useEffect(() => {
        setOrganizations(graph_to_ul(meta_org));
    }, [meta_org]);

    return (
        <section id="metadata">
            <h1>Metadata</h1>
            <MetadataSection title={"Names"}>{names}</MetadataSection>
            <MetadataSection title={"Urls"}>{urls}</MetadataSection>
            <MetadataSection title={"Keywords"}>{keywords}</MetadataSection>
            <MetadataSection title={"Identifiers"}>{identifiers}</MetadataSection>
            <MetadataSection title={"Organizations"}>{organizations}</MetadataSection>
        </section>
    );
}

type MetadataSectionProps = { title: string, children: Array<ReactNode> }
const MetadataSection = ({ title, children }: MetadataSectionProps ) => {
    if (children) {
        return <div className="subsection"><h2>{title}</h2>{children}</div>
    }
}

async function pad_metadata(pad_id: string, engine: QueryEngine) {
    const query = `
        construct {
            ?b ?p ?o .
            ?b ppo:_src ?creator .
        }
        where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion { ?s a ppo:Platform ; ?p ?o } .
            optional { 
                graph ?g { ?s a ppo:Platform ; ?p ?o } .
                ?g dcterms:creator ?creator
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
            ?b ppo:_src ?creator .
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
                graph ?g { ?s a ppo:Platform ; ?p ?o } .
                ?g dcterms:creator ?creator
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `
    return await query_jsonld(query, engine);
}

async function pad_metadata_organizations(pad_id: string, engine: QueryEngine) {
    const query = `
        construct {
            ?org ?p ?o .
            ?org ppo:_src ?creator .
        }
        where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform ; ppo:hasOrganization ?org .
                ?org ?p ?o .
            } .
            optional { 
                graph ?g {
                    ?platform a ppo:Platform ; ppo:hasOrganization ?org .
                }
                ?g dcterms:creator ?creator
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `
    return await query_jsonld(query, engine);
}

export default MetadataComponent;
