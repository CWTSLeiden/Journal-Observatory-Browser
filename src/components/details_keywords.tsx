import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../context";
import { Quadstore } from "quadstore";
import { Chip } from "@mui/material";
import { ld_zip_src } from "../query/ld";
import { DetailsChips, SourceWrapper } from "./details";
import { query_jsonld } from "../query/local";

export const PlatformKeywords = () => {
    const [keywords, setKeywords] = useState([])
    const [loading, setLoading] = useState(true);
    const padStore = useContext(PadContext)
    useEffect(() => {
        const render = async () => {
            const result = await platform_keywords(padStore)
            const items = ld_zip_src(result, "ppo:hasKeyword")
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
            ?platform ppo:hasKeyword ?o .
            ?platform ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a . 
            graph ?a { ?platform a ppo:Platform ; ppo:hasKeyword ?o . }
            optional {
                ?a pad:hasSourceAssertion ?source
                graph ?source { ?_ ppo:hasKeyword ?o }
            }
        }
    `;
    return await query_jsonld(query, store);
}
