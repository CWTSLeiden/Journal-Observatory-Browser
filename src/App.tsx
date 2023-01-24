import "./styles.css";
import React, { useState, useEffect } from "react";
import { LinkItUrl } from "react-linkify-it";
import { Buffer } from "buffer";
import { QueryEngine } from "@comunica/query-sparql";
import { pad_doc, pad_single, platform_name_single } from "./query/pad";
import MetadataComponent from "./components/metadata";

window.Buffer = Buffer;

function App() {
    const [pad_id, setPadId] = useState(undefined);
    const [pad_name, setPadName] = useState("loading...");
    const [doc, setDoc] = useState("loading...");
    const sparqlEngine = new QueryEngine();

    useEffect(() => {
        async function render() {
            setPadId(await pad_single(0, sparqlEngine));
        }
        render();
    }, []);

    useEffect(() => {
        async function render() {
            if (pad_id) {
                setPadName(await platform_name_single(pad_id, sparqlEngine));
            }
        }
        render();
    }, [pad_id]);

    useEffect(() => {
        async function render() {
            if (pad_id) {
                setDoc(await pad_doc(pad_id, sparqlEngine));
            }
        }
        render();
    }, [pad_id]);

    return (
        <div className="App">
            <section>
                <title>{pad_name}</title>
                <ul>
                <li id="pad_id">
                    Pad ID: <LinkItUrl>{pad_id}</LinkItUrl>
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

export default App;
