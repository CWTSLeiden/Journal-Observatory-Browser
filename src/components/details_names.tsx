import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { first, ld_cons_src, ld_to_str } from "../query/jsonld_helpers";
import { DetailsCard, DetailsListItem, SourceWrapper } from "./details";

export const PlatformNames = () => {
    const padStore = useContext(PadContext)
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_names(padStore)
            setNames(ld_cons_src(result))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);
    return (
        <DetailsCard title="Names" loading={loading}>
            {names.map(([n, s]) => (
                <SourceWrapper key={ld_to_str(n["@id"])} src={s} >
                    <DetailsListItem
                        primary={ld_to_str(n["schema:name"])}
                        link={ld_to_str(first(n, "schema:url"))}
                    />
                </SourceWrapper>
            )).filter(Boolean)}
        </DetailsCard>
    )
}

async function platform_names(store: Quadstore) {
    const query = `
        construct {
            ?name schema:name ?name .
            ?name schema:url ?url .
            ?name ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?assertion . 
            graph ?assertion {
                ?platform a ppo:Platform ; schema:name ?name .
                optional { ?platform schema:url ?url } .
            }
            optional {
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { ?source_platform schema:name ?name }
            }
        }
    `;
    return await query_jsonld(query, store)
}
