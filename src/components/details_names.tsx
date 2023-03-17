import React, { useState, useEffect, useContext } from "react";
import { LabelContext, PadContext } from "../context";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { ld_zip_src } from "../query/ld";
import { DetailsCard, DetailsListItem, SourceWrapper } from "./details";

export const PlatformNames = () => {
    const padStore = useContext(PadContext)
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_names(padStore)
            const items = ld_zip_src(result, "schema:name")
            setNames(items)
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);
    return (
        <DetailsCard title="Names" loading={loading}>
            {names.map(([, n, s]) => (
                <SourceWrapper key={n} src={s} >
                    <DetailsListItem
                        key={n}
                        primary={n}
                    />
                </SourceWrapper>
            )).filter(Boolean)}
        </DetailsCard>
    )
}

async function platform_names(store: Quadstore) {
    const query = `
        construct {
            ?s schema:name ?o .
            ?s ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a . 
            graph ?a { ?s a ppo:Platform ; schema:name ?o . }
            optional {
                ?a pad:hasSourceAssertion ?source
                graph ?source { ?_ schema:name ?o }
            }
        }
    `;
    return await query_jsonld(query, store)
}
