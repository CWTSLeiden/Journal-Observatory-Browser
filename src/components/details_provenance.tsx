import React from "react"
import { Box, Card, CardContent, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { OpenInNew } from "@mui/icons-material"
import { InfoDialog } from "./info"
import context from "../strings/context.json";
import info from "../strings/info.json";
import { compact_id, expand_id } from "../query/jsonld_helpers";

const pad_assertion_sparqurl = (pad_id: string) => {
    const query = `
PREFIX pad: <${context["pad"]}>
PREFIX ppo: <${context["ppo"]}>
CONSTRUCT {
    ?s ?p ?o
}
WHERE { 
    SERVICE <repository:job> {
        pad:${pad_id} a pad:PAD ;
            pad:hasAssertion ?assertion .
        graph ?assertion { ?s ?p ?o } .
    }
}
    `
    const endpoint = 'https://sparql.journalobservatory.org/sparql'
    const tabname = compact_id(pad_id)
    const sparqurl = `${endpoint}?name=${tabname}&infer=true&sameAs=true&query=${query}`
    return encodeURI(sparqurl)
}

const pad_url = (pad_id: string, format?: string) => {
    if (format) {
        return expand_id(pad_id) + `?format=${format}`
    }
    return expand_id(pad_id)
}


export const Provenance = ({pad_id}: {pad_id: string}) => {
    const LinkButton = ({title, url}: {title: string, url?: string}) => (
        <ListItemButton href={url} target="_blank">
            <ListItemIcon>
                <OpenInNew fontSize="small" />
            </ListItemIcon>
            <ListItemText>
                <Typography variant="button">
                    {title}
                </Typography>
            </ListItemText>
        </ListItemButton>
    )
    return (
        <Card variant="outlined">
            <CardContent>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 600 }}>Provenance</Typography>
                    <InfoDialog property="provenance-title" text={info["provenance-text"]}/>
                </Box>
            </CardContent>
            <Divider />
            <CardContent>
                <List>
                    <LinkButton title="sparql" url={pad_assertion_sparqurl(pad_id)} />
                    <LinkButton title="json-ld" url={pad_url(pad_id)} />
                    <LinkButton title="trig" url={pad_url(pad_id, "trig")} />
                    <LinkButton title="html" url={pad_url(pad_id, "html")} />
                </List>
            </CardContent>
        </Card>
    )
}
