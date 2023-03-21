import "../styles.css"
import "../details.css"
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { OntologyContext, PadContext } from "../context";
import { ld_to_str, pad_id_norm } from "../query/ld";
import { query_jsonld } from "../query/local";
import { pad_store } from "../query/pad_store"
import { mergeQuadstores } from "../query/local";
import { Quadstore } from "quadstore";
import { Grid, IconButton, useTheme } from "@mui/material";
import { PadSourcesBar } from "../components/pad_sources";
import { PlatformTitle } from "../components/details_title";
import { PlatformKeywords } from "../components/details_keywords";
import { PlatformNames } from "../components/details_names";
import { PlatformIdentifiers } from "../components/details_identifiers";
import { ChevronLeft } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store";
import * as actions from "../actions/details"
import { PlatformPublishers } from "../components/details_publishers";
import { PlatformPubPolicies } from "../components/details_publication_policy";

function DetailsComponent() {
    const pad_id = pad_id_norm(useParams().id)
    const ontologyStore = useContext(OntologyContext)
    const [padStore, setPadStore] = useState(undefined)
    const sidebar = useAppSelector(s => s.details.sidebar)
    const sidebarwidth = 400
    const dispatch = useAppDispatch()
    const theme = useTheme()

    // Set PAD Store
    useEffect(() => {
        const render = async () => {
            const store = await pad_store(pad_id)
            await mergeQuadstores(store, [ontologyStore])
            setPadStore(store)
        }
        ontologyStore ? render() : null
    }, [ontologyStore, dispatch, pad_id]);

    // Set Sources
    useEffect(() => {
        const render = async () => {
            const src = await pad_sources(padStore)
            dispatch(actions.sources_set(src))
        }
        padStore ? render() : null
    }, [padStore, dispatch])

    return (
        <PadContext.Provider value={padStore}>
            <Grid component="main" container spacing={2} sx={{pr: sidebar ? `${sidebarwidth}px` : 0}}>
                <Grid item xs={12}><PlatformTitle pad_id={pad_id} /></Grid>
                <Grid item xs={12}><PlatformKeywords /></Grid>
                <Grid item xs={6}><PlatformNames /></Grid>
                <Grid item xs={6}><PlatformIdentifiers /></Grid>
                <Grid item xs={6}><PlatformPublishers /></Grid>
                <Grid item xs={6}><PlatformPubPolicies /></Grid>
            </Grid>
            <PadSourcesBar width={sidebarwidth} />
            <IconButton
                color="primary"
                sx={{ position: 'absolute', top: 12, right: 12 }}
                onClick={() => dispatch(actions.sidebar_toggle())}
            >
                <ChevronLeft sx={{ color: theme.palette.primary.contrastText }}/>
            </IconButton>
        </PadContext.Provider>
    );
}

async function pad_sources(store: Quadstore) {
    const query = `
        construct { ?source ?p ?o }
        where { 
        ?pad a pad:PAD ; pad:hasProvenance ?provenance .
        graph ?provenance { ?assertion pad:hasSourceAssertion ?source } .
        graph ?sprovenance { ?source ?p ?o }
        }
    `;
    const results = await query_jsonld(query, store);
    return Object.fromEntries(results.map(result => [ld_to_str(result["@id"]), result]))
}

export default DetailsComponent;
