import "./styles.css";
import React, { useState, useEffect } from "react";
import { LinkItUrl } from "react-linkify-it";
import { Buffer } from "buffer";
import { QueryEngine } from "@comunica/query-sparql";
import { pad_doc, pad_single, platform_name_single } from "./query/pad";
import DetailsComponent from "./pages/details";
import SearchComponent from "./pages/search";

window.Buffer = Buffer;

function App() {
    const [n, setN] = useState(0);
    const [pad_id, setPadId] = useState(undefined);
    const sparqlEngine = new QueryEngine();

    const previousPad = () => {setN(Math.max(0, n - 1))}
    const nextPad = () => {setN(n + 1)}

    useEffect(() => {
        async function render() {
            setPadId(await pad_single(n, sparqlEngine));
        }
        render();
    }, [n]);

    const details = (
        <div>
            <span id="header">
                <button id="padprev" onClick={previousPad}>previous</button>
                <button id="padnext" onClick={nextPad}>next</button>
            </span>
            <DetailsComponent pad_id={pad_id} />
        </div>
    );
    const search = (
        <SearchComponent />
    )
    return search
}

export default App;
