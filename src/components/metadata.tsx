import React, { useEffect, useState } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { query_jsonld } from "../query/query";
import { graph_to_ul, pgraph_to_ul } from "../query/display_pad";


type MetadataComponentProps = { pad_id: string };
function MetadataComponent(props: MetadataComponentProps) {
    const [meta, setMeta] = useState(undefined);
    const [meta_id, setMetaId] = useState(undefined);
    const [meta_org, setMetaOrg] = useState(undefined);
    const [names, setNames] = useState(<div className="subsection"></div>);
    const [urls, setUrls] = useState(<div className="subsection"></div>);
    const [keywords, setKeywords] = useState(<div className="subsection"></div>);
    const [identifiers, setIdentifiers] = useState(<div className="subsection"></div>);
    const [organizations, setOrganizations] = useState(
        <div className="subsection"></div>
    );
    const sparqlEngine = new QueryEngine();
    useEffect(() => {
        async function render() {
            if (props.pad_id) {
                setMeta(await pad_metadata(props.pad_id, sparqlEngine))
                setMetaId(await pad_metadata_identifiers(props.pad_id, sparqlEngine))
                setMetaOrg(await pad_metadata_organizations(props.pad_id, sparqlEngine))
            }
        }
        render();
    }, [props.pad_id]);

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
            <pre>{JSON.stringify(meta_org, null, 2)}</pre>
            <h1>Metadata</h1>
            <div className="subsection"><h2>Names</h2>{names}</div>
            <div className="subsection"><h2>Urls</h2>{urls}</div>
            <div className="subsection"><h2>Keywords</h2>{keywords}</div>
            <div className="subsection"><h2>Identifiers</h2>{identifiers}</div>
            <div className="subsection"><h2>Organizations</h2>{organizations}</div>
        </section>
    );
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
        values (?pad) {(<${pad_id}>)}
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
        values (?pad) {(<${pad_id}>)}
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
        values (?pad) {(<${pad_id}>)}
    `
    return await query_jsonld(query, engine);
}

export default MetadataComponent;
