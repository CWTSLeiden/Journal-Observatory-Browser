import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QueryEngine } from "@comunica/query-sparql";
import { pad_doc } from "../query/pad";

function DetailsJsonComponent() {
    const pad_id = useParams().id
    const sparqlEngine = new QueryEngine();
    const [doc, setDoc] = useState("loading...");

    useEffect(() => {
        async function render() {
            setDoc(await pad_doc(pad_id, sparqlEngine));
        }
        render();
    }, []);

    return <pre>{doc}</pre>
}

export default DetailsJsonComponent
