import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { ld_cons_src } from "../query/jsonld_helpers";
import { DetailsCard, DetailsListItem, SourceWrapper } from "./details";

export const PlatformNames = () => {
    const padStore = useContext(PadContext)
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_names(padStore)
            setNames(names_expand(result))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);
    return (
        <DetailsCard title="Names" loading={loading}>
            {names.map(([n, s]) => (
                <SourceWrapper key={n["schema:name"]} src={s} >
                    <DetailsListItem
                        key={n["schema:name"]}
                        primary={n["schema:name"]}
                        link={n["schema:url"]}
                    />
                </SourceWrapper>
            )).filter(Boolean)}
        </DetailsCard>
    )
}

async function platform_names(store: Quadstore) {
    const query = `
        construct {
            ?platform schema:name ?name .
            ?platform schema:url ?url .
            ?platform ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?assertion . 
            graph ?assertion {
                ?p a ppo:Platform ; schema:name ?name .
                optional { ?p schema:url ?url } .
            }
            optional {
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { ?platform schema:name ?name }
            }
        }
    `;
    return await query_jsonld(query, store)
}

const names_expand = (obj: object[]) => {
    const cons_src = ld_cons_src(obj)
    const expanded = cons_src.map(([n, src]) => {
        const names = n["schema:name"] || []
        if (Array.isArray(names)) {
            return names.map(name => [{...n, "schema:name": name}, src])
        }
        return [[{...n, "schema:name": names}, src]]
    })
    return expanded.flat()
}
