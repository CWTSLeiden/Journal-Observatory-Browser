import React, { useState, useEffect, useContext } from "react";
import { LabelContext, PadContext } from "../store";
import { query_jsonld } from "../query/local";
import { Quadstore } from "quadstore";
import { ld_zip_src } from "../query/jsonld_helpers";
import { DetailsCard, DetailsListItem, SourceWrapper } from "./details";
import { labelize } from "../query/labels";
import { Fingerprint } from "@mui/icons-material";
import { expand_id } from "../query/jsonld_helpers";

const links = {
    "prism:issn": "https://portal.issn.org/resource/ISSN/",
    "prism:eIssn": "https://portal.issn.org/resource/ISSN/",
    "fabio:hasIssnL": "https://portal.issn.org/resource/ISSN/"
}

export const PlatformIdentifiers = () => {
    const labels = useContext(LabelContext)
    const padStore = useContext(PadContext)
    const [identifiers, setIdentifiers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const render = async () => {
            const result = await platform_identifiers(padStore)
            const items = ld_zip_src(result)
            setIdentifiers(items)
            setLoading(false)
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
        <DetailsCard title="Identifiers" loading={loading}>
            {identifiers.map(([p, n, s]) => (
                <SourceWrapper key={n} src={s}>
                    <DetailsListItem
                        primary={display_id(n)}
                        secondary={labelize(p, labels)}
                        avatar={<Fingerprint />}
                        link={link(p, n)}
                    />
                </SourceWrapper>
            ))}
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
                ?a pad:hasSourceAssertion ?source
                graph ?source { [] a ppo:Platform ; ?p ?o } .
            } .
        }
    `;
    return await query_jsonld(query, store);
}

const display_id = (id: string) => {
    const isurl = id ? id.match(/^(https|http|www):/) : null
    return isurl ? id.replace(/.*?([^/]+)$/,"$1") : id.replace(/.*?:/, '')
}
