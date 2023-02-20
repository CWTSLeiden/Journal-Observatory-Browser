import "../styles.css"
import "../details.css"
import React, { useState, useEffect, useContext } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { useParams, Link } from "react-router-dom";

import * as detailsActions from "../actions/details"
import MetadataComponent from "../components/metadata";
import { AppContext, PadContext } from "../context";
import { compact_id, expand_id } from "../config";
import { pad_id_norm, platform_name_single } from "../query/pad";
import { query_jsonld, query_select, Sources } from "../query/query";
import { pad_store } from "../query/pad_store"
import { useAppDispatch } from "../store";
import PolicyComponent from "../components/policy";

function DetailsComponent() {
    const pad_id = pad_id_norm(useParams().id)
    const sparqlEngine = useContext(AppContext).sparqlEngine
    const ontologyStore = useContext(AppContext).ontologyStore
    const [padStore, setPadStore] = useState(undefined)
    const [pad_name, setPadName] = useState("loading...");
    const dispatch = useAppDispatch();

    // Set PAD Store
    useEffect(() => {
        const render = async () => setPadStore(await pad_store(pad_id, sparqlEngine))
        render()
    }, []);

    // Set Sources
    useEffect(() => {
        const render = async () => {
            const src = await pad_sources(pad_id, sparqlEngine)
            dispatch(detailsActions.set_sources(src))
        }
        pad_id ? render() : null
    }, [pad_id])

    // Set Platform Name
    useEffect(() => {
        const render = async () => 
            setPadName(await platform_name_single(pad_id, sparqlEngine, [padStore]))
        padStore ? render() : null
    }, [padStore]);

    // Set Labels
    useEffect(() => {
        const render = async () => {
            const labels = await pad_labels(sparqlEngine, [ontologyStore])
            const labels_dict = {}
            labels.map((l) => {
                labels_dict[compact_id(l.get("property").value)] = l.get("label").value 
                labels_dict[expand_id(l.get("property").value)] = l.get("label").value
            })
            dispatch(detailsActions.set_labels(labels_dict))
        }
        ontologyStore ? render() : null
    }, [ontologyStore]);

    return (
        <PadContext.Provider value={padStore}>
            <section>
                <title>{pad_name}</title>
                <ul>
                    <li id="pad_id">
                        Pad ID: <Link to={`/pad/${pad_id}`}>{pad_id}</Link>
                    </li>
                    <li id="pad_doc">
                        JSON
                    </li>
                </ul>
                <input id="docinput" type="checkbox" />
            </section>
            <MetadataComponent pad_id={pad_id} />
            <PolicyComponent pad_id={pad_id} />
        </PadContext.Provider>
    );
}


async function pad_sources(pad_id: string, engine: QueryEngine, sources?: Sources) {
    const query = `
        construct { ?s ?p ?o }
        where { 
            ?pad a pad:PAD ; pad:hasProvenance ?provenance .
            graph ?provenance { ?assertion pad:hasSourceAssertion ?source } .
            service <repository:pad> {
                ?sourcepad pad:hasAssertion ?source ; pad:hasProvenance ?sprovenance
                graph ?sprovenance { ?s ?p ?o }
            }    
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, engine, sources);
}

async function pad_labels(engine: QueryEngine, sources?: Sources) {
    const query = `
        select ?property ?label where { 
            ?property rdfs:label ?label
            filter(str(?label) != "")
        }
    `;
    return await query_select(query, engine, sources);
}

export default DetailsComponent;
