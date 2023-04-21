import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { Quadstore } from "quadstore";
import { Chip } from "@mui/material";
import { ld_zip_src } from "../query/jsonld_helpers";
import { DetailsChips, SourceWrapper } from "./details";
import { query_jsonld } from "../query/local";

export const PlatformKeywords = () => {
    const [keywords, setKeywords] = useState([])
    const [loading, setLoading] = useState(true);
    const padStore = useContext(PadContext)
    useEffect(() => {
        const render = async () => {
            const result = await platform_keywords(padStore)
            const items = ld_zip_src(result, "scpo:hasKeyword")
            setKeywords(items)
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);
    return (
        <DetailsChips loading={loading}>
            {keywords.map(([, keyword, sources])=> (
                <SourceWrapper key={keyword} src={sources}>
                    <Chip label={keyword}/>
                </SourceWrapper>
            ))}
        </DetailsChips>
    )
}

async function platform_keywords(store: Quadstore) {
    const query = `
        construct {
            ?platform scpo:hasKeyword ?o .
            ?platform scpo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a . 
            graph ?a { ?platform a scpo:Platform ; scpo:hasKeyword ?o . }
            optional {
                ?a pad:hasSourceAssertion ?source
                graph ?source { ?_ scpo:hasKeyword ?o }
            }
        }
    `;
    return await query_jsonld(query, store);
}
