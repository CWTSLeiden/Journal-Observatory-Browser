import React, { useState, useEffect, useContext } from "react";
import { LabelContext, PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { ld_cons_src } from "../query/jsonld_helpers";
import { DetailsCard, DetailsListItem, SourceWrapper } from "./details";
import { labelize } from "../query/labels";
import { CorporateFare } from "@mui/icons-material";

export const PlatformPublishers = () => {
    const labels = useContext(LabelContext)
    const padStore = useContext(PadContext)
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_publishers(padStore)
            const items = ld_cons_src(result)
            setPublishers(items)
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);

    return (
        <DetailsCard title="Publishers" loading={loading}>
            {publishers.map(([p, s]) => (
                <SourceWrapper key={p["@id"]} src={s}>
                    <DetailsListItem
                        primary={p["schema:name"] || labelize(p["@id"], labels)}
                        secondary={p["schema:url"]}
                        avatar={<CorporateFare />}
                        link={p["schema:url"] || p["@id"]}
                    />
                </SourceWrapper>
            ))}
        </DetailsCard>
    )
}

async function platform_publishers(store: Quadstore) {
    const query = `
        construct {
            ?org a pro:publisher ;
                schema:name ?name ;
                schema:url ?url ;
                ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a .
            graph ?a {
                ?platform a ppo:Platform .
                ?platform ?prop ?org .
                ?org a pro:publisher .
            }
            ?prop rdfs:subPropertyOf* dcterms:relation .
            optional { ?org schema:name ?name . }
            optional { ?org rdfs:label ?label . }
            bind(coalesce(?name, ?label) as ?name)
            optional { ?org schema:url ?url . }
            optional { 
                ?a pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ?prop ?org } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}
