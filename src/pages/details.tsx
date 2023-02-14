import "../styles.css"
import "../details.css"
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { QueryEngine } from "@comunica/query-sparql";
import { pad_doc, pad_id_norm, platform_name_single } from "../query/pad";
import MetadataComponent from "../components/metadata";
import PubPolicyComponent from "../components/publishing_policy";
import { query_jsonld, query_select } from "../query/query";
import * as detailsActions from "../actions/details"
import { useAppSelector, useAppDispatch } from "../store";

function DetailsComponent() {
    const pad_id = pad_id_norm(useParams().id)
    const [pad_name, setPadName] = useState("loading...");
    const [doc, setDoc] = useState("loading...");
    const sources = useAppSelector(store => store.details.sources)
    const dispatch = useAppDispatch();
    const sparqlEngine = new QueryEngine();

    async function setName() {
        setPadName(await platform_name_single(pad_id, sparqlEngine));
    }
    async function setRaw() {
        setDoc(await pad_doc(pad_id, sparqlEngine));
    }
    async function setSrc() {
        const src = await pad_sources(pad_id, sparqlEngine)
        dispatch(detailsActions.set_sources(src))
    }

    useEffect(() => {
        setName();
        setRaw();
        setSrc();
    }, []);

    return (
        <div className="App">
            <section>
                <title>{pad_name}</title>
                <ul>
                    <li id="pad_id">
                        Pad ID: <Link to={`/pad/${pad_id}`}>{pad_id}</Link>
                    </li>
                    <li id="pad_doc">
                        <label htmlFor="docinput">JSON</label>
                    </li>
                </ul>
                <input id="docinput" type="checkbox" />
                <section id="doc">
                    <pre>{doc}</pre>
                </section>
            </section>
            <MetadataComponent pad_id={pad_id} />
            <PubPolicyComponent pad_id={pad_id} />
        </div>
    );
}

async function pad_sources(pad_id: string, engine: QueryEngine) {
    const query = `
        construct { ?s ?p ?o }
        where { 
            ?pad a pad:PAD ; pad:hasProvenance ?provenance .
            graph ?provenance { ?assertion pad:hasSourcePAD ?source } .
            service <repository:pad> {
                ?source pad:hasProvenance ?sprovenance
                graph ?sprovenance { ?s ?p ?o }
            }    
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, engine);
}

export default DetailsComponent;
