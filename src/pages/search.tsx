import React, { useEffect } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { FilterBar } from "../components/filter";
import { SearchBar } from "../components/search";
import { PadTable, PadTablePagination } from "../components/padtable";
import { pad_list } from "../query/search";
import store, { useAppSelector, useAppDispatch } from "../store";
import * as padsActions from "../actions/pads";
import * as searchActions from "../actions/search";
import { Grid, Paper } from "@mui/material";
import { Stack, Box } from "@mui/system";

function SearchComponent() {
    const searchState = useAppSelector((s) => s.search);
    const pads = useAppSelector((s) => s.pads.pads);
    const page = useAppSelector((s) => s.search.page);
    const pagesize = useAppSelector((s) => s.search.pagesize);
    const dispatch = useAppDispatch();
    const sparqlEngine = new QueryEngine();

    async function loadPads() {
        const { padlist, num } = await pad_list(
            sparqlEngine,
            searchState,
            pagesize * page
        );
        dispatch(padsActions.set_pads(padlist));
        dispatch(padsActions.set_total(num));
    }

    async function doSearch() {
        dispatch(searchActions.resetPage());
        loadPads();
    }

    useEffect(() => {
        loadPads();
    }, [page, pagesize]);

    useEffect(() => {
        if (pads.length == 0) {
            doSearch();
        }
    }, []);

    return (
        <Grid container direction="column" spacing={1} id="search">
            <Grid item>
                <Box component={Paper} sx={{ padding: 2 }}>
                    <SearchBar handleSubmit={doSearch} />
                </Box>
            </Grid>
            <Grid container direction="row" item spacing={1}>
                <Grid item xs={12} sm={12} md={3} id="filter">
                    <Box component={Paper} sx={{ padding: 2 }}>
                        <FilterBar handleSubmit={doSearch} />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={9} container id="results">
                    <Stack direction="column" spacing={1} sx={{width: "100%"}}>
                        <PadTablePagination />
                        <PadTable />
                        <PadTablePagination />
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SearchComponent;
