import React, { useCallback, useEffect } from "react";
import { FilterBar } from "../components/filterbar";
import { SearchBar } from "../components/searchbar";
import { PadTable, PadTablePagination } from "../components/search_list";
import { pad_list } from "../query/search";
import { useAppSelector, useAppDispatch } from "../store";
import * as padsActions from "../store/pads";
import * as searchActions from "../store/search";
import { Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { order_pads } from "../store/pads";

function SearchComponent() {
    const searchState = useAppSelector((s) => s.search);
    const page = useAppSelector((s) => s.search.page);
    const pagesize = useAppSelector((s) => s.search.pagesize);
    const orderasc = useAppSelector((s) => s.search.orderasc);
    const dispatch = useAppDispatch();

    const loadPads = useCallback(async (page: number) => {
        const { padlist, num } = await pad_list(
            searchState,
            pagesize * page
        );
        dispatch(padsActions.pads_set(order_pads(padlist, orderasc)));
        dispatch(padsActions.total_set(num));
    }, [dispatch, orderasc, pagesize, searchState])

    async function doSearch() {
        dispatch(searchActions.page_reset());
        loadPads(0);
    }

    useEffect(() => {
        loadPads(page);
    }, [page, pagesize, loadPads]);

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
