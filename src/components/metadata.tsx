import React, { useEffect, useState } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { query_jsonld } from "../query/query";
import { graph_to_li, fold_graph } from "../query/display_pad";

type MetadataComponentProps = { pad_id: string };
function MetadataComponent(props: MetadataComponentProps) {
    const [meta, setMeta] = useState(undefined);
    const [meta_id, setMetaId] = useState(undefined);
    const [meta_org, setMetaOrg] = useState(undefined);
    const [doc, setDoc] = useState("");
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
                const doc = await pad_doc(props.pad_id, sparqlEngine)
                // setDoc(JSON.stringify(doc["@graph"], null, 2));
                const metadata = await pad_metadata(props.pad_id, sparqlEngine);
                setMeta(metadata)
                const metadata_id = await pad_metadata_identifiers(props.pad_id, sparqlEngine)
                setMetaId(metadata_id)
                const metadata_org = await pad_metadata_organizations(props.pad_id, sparqlEngine)
                setMetaOrg(metadata_org)
            }
        }
        render();
    }, [props.pad_id]);

    useEffect(() => {
        setNames(graph_to_li(meta, "schema:name"));
        setUrls(graph_to_li(meta, "schema:url"));
        setKeywords(graph_to_li(meta, "ppo:hasKeyword"));
    }, [meta]);

    useEffect(() => {
        setIdentifiers(graph_to_li(meta_id));
    }, [meta_id]);

    useEffect(() => {
        setDoc(JSON.stringify(meta_org, null, 2));
        setOrganizations(graph_to_li(meta_org));
    }, [meta_org]);

    return (
        <section id="metadata">
            <h1>Metadata</h1>
            <div className="subsection"><h2>Names</h2>{names}</div>
            <div className="subsection"><h2>Urls</h2>{urls}</div>
            <div className="subsection"><h2>Keywords</h2>{keywords}</div>
            <div className="subsection"><h2>Identifiers</h2>{identifiers}</div>
            <div className="subsection"><h2>Organizations</h2>{organizations}</div>
            <pre>{doc}</pre>
        </section>
    );
}

async function pad_doc(pad_id: string, engine: QueryEngine) {
    const query = `
        construct {
            ?s ?p ?o .
        }
        where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion { ?s ?p ?o } .
        }
        values (?pad) {(<${pad_id}>)}
    `;
    return await query_jsonld(query, engine);
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
            ?g ?p ?o .
            ?g ppo:_src ?creator .
        }
        where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion { ?s a ppo:Platform ; ?p ?o } .
            ?p rdfs:subPropertyOf ?type.
            filter(?type in (dcterms:identifier))
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
