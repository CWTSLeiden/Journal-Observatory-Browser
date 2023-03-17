import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../context";
import { Quadstore } from "quadstore";
import { Chip, Grid } from "@mui/material";
import { ld_zip_src } from "../query/ld";
import { SourceWrapper } from "./details";
import { query_jsonld } from "../query/local";

export const PlatformKeywords = () => {
    const [keywords, setKeywords] = useState([])
    const padStore = useContext(PadContext)
    useEffect(() => {
        const render = async () => {
            const result = await platform_keywords(padStore)
            const items = ld_zip_src(result, "ppo:hasKeyword")
            setKeywords(items)
        }
        padStore ? render() : null
    }, [padStore]);

    return (
        <Grid container direction="row" spacing={1}>
            {keywords.map(([, keyword, sources])=> (
                <Grid item key={keyword}>
                    <SourceWrapper src={sources}>
                        <Chip label={keyword}/>
                    </SourceWrapper>
                </Grid>
            ))}
        </Grid>
    )
}

async function platform_keywords(store: Quadstore) {
    const query = `
        construct {
            ?s ppo:hasKeyword ?o .
            ?s ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a . 
            graph ?a { ?s a ppo:Platform ; ppo:hasKeyword ?o . }
            optional {
                ?a pad:hasSourceAssertion ?source
                graph ?source { ?_ ppo:hasKeyword ?o }
            }
        }
    `;
    console.log("Perform query", Date.now())
    return await query_jsonld(query, store);
}
