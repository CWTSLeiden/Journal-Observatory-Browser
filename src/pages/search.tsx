import React, { useEffect } from "react";
import { FilterBar } from "../components/filterbar";
import { SearchBar } from "../components/searchbar";
import { PadTable, PadTablePagination } from "../components/padtable";
import { pad_list } from "../query/search";
import { useAppSelector, useAppDispatch } from "../store";
import * as padsActions from "../actions/pads";
import * as searchActions from "../actions/search";
import { Grid } from "@mui/material";
import { Stack } from "@mui/system";

function SearchComponent() {
    const searchState = useAppSelector((s) => s.search);
    const page = useAppSelector((s) => s.search.page);
    const pagesize = useAppSelector((s) => s.search.pagesize);
    const orderasc = useAppSelector((s) => s.search.orderasc);
    const dispatch = useAppDispatch();

    async function loadPads() {
        const { padlist, num } = await pad_list(
            searchState,
            pagesize * page
        );
        dispatch(padsActions.set_pads(padlist, orderasc));
        dispatch(padsActions.set_total(num));
    }

    async function doSearch() {
        dispatch(searchActions.reset_page());
        loadPads();
    }

    useEffect(() => {
        loadPads();
    }, [page, pagesize]);

    return (
        <Grid container direction="column" spacing={2} id="search">
            <Grid item>
                <SearchBar handleSubmit={doSearch} />
            </Grid>
            <Grid container direction="row" item spacing={2}>
                <Grid item xs={12} sm={12} md={3} id="filter">
                    <FilterBar handleSubmit={doSearch} />
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
