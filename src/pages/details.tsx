import "../styles.css"
import "../details.css"
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";

import * as detailsActions from "../actions/details"
import MetadataComponent from "../components/metadata";
import { AppContext, PadContext } from "../context";
import { pad_id_norm } from "../query/display_pad";
import { query_jsonld, query_single } from "../query/local";
import { pad_store } from "../query/pad_store"
import { useAppDispatch } from "../store";
import PolicyComponent from "../components/policy";
import { mergeQuadstores } from "../query/local";
import { Quadstore } from "quadstore";

function DetailsComponent() {
    const pad_id = pad_id_norm(useParams().id)
    const ontologyStore = useContext(AppContext).ontologyStore
    const [padStore, setPadStore] = useState(undefined)
    const [pad_name, setPadName] = useState("loading...");
    const dispatch = useAppDispatch();

    // Set PAD Store
    useEffect(() => {
        const render = async () => {
            const store = await pad_store(pad_id)
            await mergeQuadstores(store, [ontologyStore])
            setPadStore(store)
        }
        ontologyStore ? render() : null
    }, [ontologyStore]);

    // Set Sources
    useEffect(() => {
        const render = async () => {
            const src = await pad_sources(pad_id, padStore)
            dispatch(detailsActions.set_sources(src))
        }
        padStore ? render() : null
    }, [padStore])

    // Set Platform Name
    useEffect(() => {
        const render = async () => 
            setPadName(await pad_names(pad_id, padStore))
        padStore ? render() : null
    }, [padStore]);

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

async function pad_names(pad_id: string, store: Quadstore) {
    const query = `
        select ?name where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion { ?s a ppo:Platform ; schema:name ?name }
        }
        values (?pad) {(pad:${pad_id})}
    `;
    const name = await query_single(query, store)
    return name || pad_id
}

async function pad_sources(pad_id: string, store: Quadstore) {
    const query = `
        construct { ?source ?p ?o }
        where { 
            ?pad a pad:PAD ; pad:hasProvenance ?provenance .
            graph ?provenance { ?assertion pad:hasSourceAssertion ?source } .
            graph ?sprovenance { ?source ?p ?o }
        }
        values (?pad) {(pad:${pad_id})}
    `;
    return await query_jsonld(query, store);
}

export default DetailsComponent;
