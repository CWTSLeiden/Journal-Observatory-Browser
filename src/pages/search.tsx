import React, { useEffect, useState } from "react";
import { FilterBar } from "../components/filterbar";
import { SearchBar } from "../components/searchbar";
import { PadList, PadListPagination } from "../components/search_list";
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
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState(200)

    const loadPads = async (page: number) => {
        setStatus(200)
        setLoading(true)
        try {
            const { padlist, num } = await pad_list(searchState, pagesize * page);
            dispatch(padsActions.pads_set(order_pads(padlist, orderasc)));
            dispatch(padsActions.total_set(num));
        } catch(err) {
            console.log(err)
            dispatch(padsActions.pads_clear());
            dispatch(padsActions.total_set(0));
            setStatus(500)
        }
        setLoading(false)
    }

    async function doSearch() {
        dispatch(searchActions.page_reset());
        loadPads(0);
    }

    useEffect(() => {
        loadPads(page);
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
                    <Stack direction="column" spacing={2} sx={{width: "100%"}}>
                        <PadListPagination loading={loading} />
                        <PadList loading={loading} status={status} />
                        <PadListPagination loading={loading} />
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SearchComponent;
