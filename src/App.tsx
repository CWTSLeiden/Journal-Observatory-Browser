import "./styles.css";
import React, { useState, useEffect, Component } from "react";
import { Buffer } from "buffer";
import { QueryEngine } from "@comunica/query-sparql";
import { pad_single } from "./query/pad";
import MetadataComponent from "./components/metadata";

window.Buffer = Buffer;

function App() {
    const [pad_id, setPadId] = useState(undefined);
    const [pad_name, setPadName] = useState("loading...");
    const sparqlEngine = new QueryEngine();

    useEffect(() => {
        async function render() {
            setPadId(await pad_single(0, sparqlEngine));
        }
        render();
    }, []);

    useEffect(() => {
        setPadName(pad_id)
    }, [pad_id])

    return (
        <div className="App">
            <h1>{pad_name}</h1>
            <MetadataComponent pad_id={pad_id} />
        </div>
    );
}

export default App;
