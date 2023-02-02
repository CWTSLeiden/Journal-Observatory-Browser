import React, { useState, useEffect } from "react";
import { LinkItUrl } from "react-linkify-it";
import { QueryEngine } from "@comunica/query-sparql";
import { pad_doc, platform_name_single } from "../query/pad";
import MetadataComponent from "../components/metadata";

type DetailsComponentProps = { pad_id: string };
function DetailsComponent(props: DetailsComponentProps) {
    const [pad_name, setPadName] = useState("loading...");
    const [doc, setDoc] = useState("loading...");
    const sparqlEngine = new QueryEngine();

    useEffect(() => {
        async function render() {
            if (props.pad_id) {
                setPadName(props.pad_id.replace(/.*\/pad\//i, ""))
                setPadName(await platform_name_single(props.pad_id, sparqlEngine));
            }
        }
        render();
    }, [props.pad_id]);

    useEffect(() => {
        async function render() {
            if (props.pad_id) {
                setDoc(await pad_doc(props.pad_id, sparqlEngine));
            }
        }
        render();
    }, [props.pad_id]);

    return (
        <div className="App">
            <section>
                <title>{pad_name}</title>
                <ul>
                    <li id="props.pad_id">
                        Pad ID: <LinkItUrl>{props.pad_id}</LinkItUrl>
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
            <MetadataComponent pad_id={props.pad_id} />
        </div>
    );
}

export default DetailsComponent;
