import React, { useEffect, useState, ReactNode, useContext } from "react";
import { query_jsonld } from "../query/local";
import { graph_to_ul, pgraph_to_ul } from "../query/display_pad";
import { PadContext } from "../context";
import { Quadstore } from "quadstore";

type MetadataComponentProps = { pad_id: string };
function MetadataComponent({ pad_id }: MetadataComponentProps) {
    const padStore = useContext(PadContext)
    const [meta_name, setMetaName] = useState(undefined);
    const [meta_url, setMetaUrl] = useState(undefined);
    const [meta_keywords, setMetaKeyword] = useState(undefined);
    const [meta_id, setMetaId] = useState(undefined);
    const [meta_org, setMetaOrg] = useState(undefined);

    useEffect(() => {
        async function render() {
            setMetaName(await pad_metadata_name(pad_id, padStore));
        }
        padStore ? render() : null;
    }, [padStore])

    useEffect(() => {
        async function render() {
            setMetaUrl(await pad_metadata_url(pad_id, padStore));
        }
        padStore ? render() : null;
    }, [padStore])

    useEffect(() => {
        async function render() {
            setMetaKeyword(await pad_metadata_keyword(pad_id, padStore));
        }
        padStore ? render() : null;
    }, [padStore])

    useEffect(() => {
        async function render() {
            setMetaId(await pad_metadata_identifiers(pad_id, padStore));
        }
        padStore ? render() : null;
    }, [padStore]);

    useEffect(() => {
        async function render() {
            setMetaOrg(await pad_metadata_organizations(pad_id, padStore));
        }
        padStore ? render() : null;
    }, [padStore])

    return (
        <section id="metadata">
            <h1>Metadata</h1>
            <MetadataSection title={"Names"}>
                {pgraph_to_ul(meta_name, "schema:name")}
            </MetadataSection>
            <MetadataSection title={"Urls"}>
                {pgraph_to_ul(meta_url, "schema:url")}
            </MetadataSection>
            <MetadataSection title={"Keywords"}>
                {pgraph_to_ul(meta_keywords, "ppo:hasKeyword")}
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

async function pad_metadata_name(pad_id: string, store: Quadstore) {
    const query = `
        construct {
            ?s schema:name ?o .
            ?s ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a . 
            graph ?a { ?s a ppo:Platform ; schema:name ?o . }
            optional {
                ?a pad:hasSourceAssertion ?source
                graph ?source { ?_ schema:name ?o }
            }
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, store);
}

async function pad_metadata_url(pad_id: string, store: Quadstore) {
    const query = `
        construct {
            ?s schema:url ?o .
            ?s ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a . 
            graph ?a { ?s a ppo:Platform ; schema:url ?o . }
            optional {
                ?a pad:hasSourceAssertion ?source
                graph ?source { ?_ schema:url ?o }
            }
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, store);
}

async function pad_metadata_keyword(pad_id: string, store: Quadstore) {
    const query = `
        construct {
            ?s ppo:hasKeyword ?o .
            ?s ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a . 
            graph ?a { ?s a ppo:Platform ; ppo:hasKeyword ?o . }
            optional {
                ?a pad:hasSourceAssertion ?source
                graph ?source { ?_ ppo:hasKeyword ?o }
            }
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, store);
}

async function pad_metadata_identifiers(pad_id: string, store: Quadstore) {
    const query = `
        construct {
            ?b ?p ?o .
            ?b ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a .
            graph ?a { ?s a ppo:Platform ; ?p ?o } .
            ?p rdfs:subPropertyOf dcterms:identifier.
            bind(uuid() as ?b)
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ?p ?o } .
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, store);
}

async function pad_metadata_organizations(pad_id: string, store: Quadstore) {
    const query = `
        construct {
            ?org ?p ?o .
            ?org ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a .
            graph ?a {
                ?s a ppo:Platform ; ppo:hasOrganization ?org .
                ?org ?p ?o .
            } .
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ppo:hasOrganization ?org } .
            } .
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, store);
}

export default MetadataComponent;
