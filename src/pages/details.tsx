import "../styles.css"
import "../details.css"
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { QueryEngine } from "@comunica/query-sparql";
import { pad_doc, platform_name_single } from "../query/pad";
import MetadataComponent from "../components/metadata";

function DetailsComponent() {
    const pad_id = useParams().id
    const [pad_name, setPadName] = useState("loading...");
    const [doc, setDoc] = useState("loading...");
    const sparqlEngine = new QueryEngine();

    useEffect(() => {
        async function render() {
            if (pad_id) {
                setPadName(pad_id.replace(/.*\/pad\//i, ""))
                setPadName(await platform_name_single(pad_id, sparqlEngine));
                setDoc(await pad_doc(pad_id, sparqlEngine));
            }
        }
        render();
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
        </div>
    );
}

export default DetailsComponent;
