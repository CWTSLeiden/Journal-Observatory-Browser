import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../context";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack } from "@mui/material";
import { ld_zip_src } from "../query/ld";
import { DetailsCard, DetailsListItem, SourceWrapper } from "./details";
import { labelize } from "../query/labels";
import { Fingerprint, Link } from "@mui/icons-material";
import { expand_id } from "../config";

const links = {
    "prism:issn": "https://portal.issn.org/resource/ISSN/",
    "prism:eIssn": "https://portal.issn.org/resource/ISSN/",
    "fabio:hasIssnL": "https://portal.issn.org/resource/ISSN/"
}

export const PlatformIdentifiers = () => {
    const [identifiers, setIdentifiers] = useState([]);
    const padStore = useContext(PadContext)
    useEffect(() => {
        const render = async () => {
            const result = await platform_identifiers(padStore)
            const items = ld_zip_src(result)
            setIdentifiers(items)
        }
        padStore ? render() : null
    }, [padStore]);
    const link = (p: string, s: string) => {
        if (links[p]) {
            return `${links[p]}${s}`
        }
        return expand_id(s)
    }

    return (
        <DetailsCard title="Identifiers">
            <Stack direction="column" spacing={1}>
                {identifiers.map(([p, n, s]) => (
                    <SourceWrapper key={n} src={s}>
                        <DetailsListItem
                            primary={n.replace(/.*?:/, '')}
                            secondary={labelize(p)}
                            avatar={<Fingerprint />}
                            link={link(p, n)}
                        />
                    </SourceWrapper>
                ))}
            </Stack>
        </DetailsCard>
    )
}

async function platform_identifiers(store: Quadstore) {
    const query = `
        construct {
            ?b ?p ?o .
            ?b ppo:_src ?source .
        }
        where {
            ?pad pad:hasAssertion ?a .
            graph ?a { ?s a ppo:Platform ; ?p ?o } .
            ?p rdfs:subPropertyOf dcterms:identifier.
            bind(uuid() as ?b)
            optional { 
                ?assertion pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ?p ?o } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}
