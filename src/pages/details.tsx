import "../styles.css"
import "../details.css"
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { OntologyContext, PadContext } from "../store";
import { ld_to_str, pad_id_norm } from "../query/jsonld_helpers";
import { query_jsonld } from "../query/local";
import { pad_store } from "../query/pad_store"
import { mergeQuadstores } from "../query/local";
import { Quadstore } from "quadstore";
import { Grid, Stack } from "@mui/material";
import { PadSources } from "../components/details_sources";
import { PlatformTitle } from "../components/details_title";
import { PlatformKeywords } from "../components/details_keywords";
import { PlatformNames } from "../components/details_names";
import { PlatformIdentifiers } from "../components/details_identifiers";
import { useAppDispatch } from "../store";
import * as actions from "../store/details"
import { PlatformPublishers } from "../components/details_publishers";
import { PlatformPubPolicies } from "../components/details_publication_policy";
import { PlatformElsewherePolicies } from "../components/details_elsewhere_policy";
import { PlatformEvaluationPolicies } from "../components/details_evaluation_policy";
import { Provenance } from "../components/details_provenance";
import context from "../strings/context.json";

function DetailsComponent() {
    const pad_id = context["job"] + pad_id_norm(useParams().id)
    const ontologyStore = useContext(OntologyContext)
    const [padStore, setPadStore] = useState(undefined)
    const dispatch = useAppDispatch()

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
            dispatch(actions.sources_clear())
            const src = await pad_sources(padStore)
            dispatch(actions.sources_set(src))
        }
        padStore ? render() : null
    }, [padStore, dispatch])

    return (
        <PadContext.Provider value={padStore}>
            <Grid container direction="column" spacing={2} id="search">
                <Grid item xs={12}><PlatformTitle pad_id={pad_id} /></Grid>
                <Grid container direction="row" item spacing={2}>
                    <Grid item xs={12} sm={12} md={4} lg={3} id="filter">
                        <Stack spacing={2}>
                            <PadSources />
                            <Provenance pad_id={pad_id} />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={9} component="main" container spacing={2} sx={{pb: 2}}>
                        <Grid item xs={12}><PlatformKeywords /></Grid>
                        <Grid item xs={12}><PlatformNames /></Grid>
                        <Grid item xs={12}><PlatformIdentifiers /></Grid>
                        <Grid item xs={12}><PlatformPublishers /></Grid>
                        <Grid item xs={12}><PlatformPubPolicies /></Grid>
                        <Grid item xs={12}><PlatformElsewherePolicies /></Grid>
                        <Grid item xs={12}><PlatformEvaluationPolicies /></Grid>
                    </Grid>
                </Grid>
            </Grid>
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
