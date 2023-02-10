import React, { useState, useEffect } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { FilterBar } from "../components/filter";
import { SearchBar } from "../components/search";
import { PadTable } from "../components/padtable";
import { pad_list } from "../query/search";
import store, { useAppSelector, useAppDispatch } from "../store";
import * as padsActions from "../actions/pads";

type PagingComponentProps = { handleClick: () => void };
const PagingComponent = ({ handleClick }: PagingComponentProps) => {
    const num = useAppSelector((s) => s.pads.pads.length);
    const total = useAppSelector((s) => s.pads.total);
    return (
        <button onClick={handleClick} className="paging">
            <div>
                {num == total ? `${num}` : `${num}/${total}`}
                {num < total ? "+" : ""}
            </div>
        </button>
    );
};

function SearchComponent() {
    const pads = useAppSelector((s) => s.pads.pads);
    const dispatch = useAppDispatch();
    const sparqlEngine = new QueryEngine();

    async function doSearch() {
        const { padlist, num } = await pad_list(
            sparqlEngine,
            store.getState()
        );
        dispatch(padsActions.set_pads(padlist));
        dispatch(padsActions.set_total(num));
    }

    async function nextPage() {
        const { padlist, num } = await pad_list(
            sparqlEngine,
            store.getState(),
            pads.length
        );
        dispatch(padsActions.add_pads(padlist));
        dispatch(padsActions.set_total(num));
    }

    useEffect(() => {
        doSearch();
    }, []);

    return (
        <div className="Search">
            <header>Header</header>
            <SearchBar handleSubmit={doSearch} />
            <div id="main">
                <FilterBar handleSubmit={doSearch} />
                <PadTable padlist={pads} />
            </div>
            <PagingComponent handleClick={nextPage} />
        </div>
    );
}

export default SearchComponent;
