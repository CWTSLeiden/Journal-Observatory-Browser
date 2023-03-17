import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../context";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { Avatar, Card, List, ListItem, ListItemAvatar, ListItemText, Paper } from "@mui/material";
import { ld_zip_src } from "../query/ld";
import { DetailsCard, DetailsListItem, SourceWrapper } from "./details";
import { Fingerprint } from "@mui/icons-material";
import { labelize } from "../query/labels";

export const PlatformNames = () => {
    const [names, setNames] = useState([]);
    const padStore = useContext(PadContext)
    useEffect(() => {
        const render = async () => {
            const result = await platform_names(padStore)
            const items = ld_zip_src(result, "schema:name")
            setNames(items)
        }
        padStore ? render() : null
    }, [padStore]);

    return (
        <DetailsCard title="Names">
            <List>
                {names.map(([p, n, s]) => (
                    <SourceWrapper key={n} src={s} >
                        <DetailsListItem
                            primary={n}
                            secondary={labelize(p)}
                        />
                    </SourceWrapper>
                ))}
            </List>
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
