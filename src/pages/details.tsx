import "../styles.css"
import "../details.css"
import React, { useState, useEffect, useContext, ReactElement } from "react";
import { useParams } from "react-router-dom";

import MetadataComponent from "../components/metadata";
import { OntologyContext, PadContext, SourcesContext } from "../context";
import { ld_to_str, pad_id_norm } from "../query/ld";
import { query_jsonld, query_select_first } from "../query/local";
import { pad_store } from "../query/pad_store"
import PolicyComponent from "../components/policy";
import { mergeQuadstores } from "../query/local";
import { Quadstore } from "quadstore";
import { AppBar, Badge, Box, Chip, Container, Divider, Drawer, Grid, IconButton, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import { PadSourcesBar } from "../components/pad_sources";
import { labelize } from "../query/labels";
import { blue, indigo, red } from "@mui/material/colors";
import { PlatformTitle } from "../components/details_title";
import { PlatformKeywords } from "../components/details_keywords";
import { colorize } from "../components/theme";
import { PlatformNames } from "../components/details_names";
import { PlatformIdentifiers } from "../components/details_identifiers";
import { ChevronRight } from "@mui/icons-material";

function DetailsComponent() {
    const pad_id = pad_id_norm(useParams().id)
    const ontologyStore = useContext(OntologyContext)
    const [padStore, setPadStore] = useState(undefined)
    const [sources, setSources] = useState([])
    const [drawerState, setDrawerState] = useState<boolean>(true)
    const drawerWidth = 400
    const theme = useTheme()

    // Set PAD Store
    useEffect(() => {
        const render = async () => {
            const store = await pad_store(pad_id)
            await mergeQuadstores(store, [ontologyStore])
            setPadStore(store)
        }
        ontologyStore ? render() : null
    }, [ontologyStore]);

    // Set Sources
    useEffect(() => {
        const render = async () => {
            const src = await pad_sources(padStore)
            setSources(src)
        }
        padStore ? render() : null
    }, [padStore])

    return (
        <PadContext.Provider value={padStore}>
            <SourcesContext.Provider value={sources}>
                <Grid component="main" container spacing={2} sx={{pr: drawerState ? `${drawerWidth}px` : 0}}>
                    <Grid item xs={12}><PlatformTitle /></Grid>
                    <Grid item xs={12}><PlatformKeywords /></Grid>
                    <Grid item xs={6}><PlatformNames /></Grid>
                    <Grid item xs={6}><PlatformIdentifiers /></Grid>
                </Grid>
                <Drawer
                    variant="persistent" 
                    open={drawerState}
                    anchor="right"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar>
                        <IconButton onClick={() => setDrawerState(!drawerState)}>
                            <ChevronRight />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <PadSourcesBar />
                </Drawer>
            </SourcesContext.Provider>
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
    return await query_jsonld(query, store);
}

export default DetailsComponent;
