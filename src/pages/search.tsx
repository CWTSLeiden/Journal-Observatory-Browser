import React, { useState, useEffect } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { FilterBar } from "../components/filter";
import { SearchState, SearchBar } from "../components/search";
import { PadTable } from "../components/padtable";
import { pad_list } from "../query/search";

type PagingComponentProps = {
    num: number;
    total: number;
    handlePaging: () => void;
};
const PagingComponent = ({
    num,
    total,
    handlePaging,
}: PagingComponentProps) => (
    <button onClick={handlePaging} className="paging">
        <div>
            {num == total ? `${num}` : `${num}/${total}`}
            {num < total ? "+" : ""}
        </div>
    </button>
);

function SearchComponent() {
    const newsearch: SearchState = {};
    const [padlist, setPadlist] = useState([]);
    const [padnum, setPadNum] = useState(0);
    const [search, setSearch] = useState(newsearch);
    const [doSearch, setDoSearch] = useState(search);
    const sparqlEngine = new QueryEngine();

    useEffect(() => {
        async function render() {
            const { padlist, num } = await pad_list(sparqlEngine, {
                ...doSearch,
                page: 0,
            });
            setSearch({ ...doSearch, page: 0 });
            setPadlist(padlist);
            setPadNum(num);
        }
        render();
    }, [doSearch]);

    useEffect(() => {
        async function render() {
            const { padlist: padlist_page, num } = await pad_list(
                sparqlEngine,
                { ...doSearch, page: search.page }
            );
            setPadlist(padlist.concat(padlist_page));
            setPadNum(num);
        }
        if (search.page > 0 && padlist.length < padnum) {
            render();
        }
    }, [search.page]);

    useEffect(() => {
        // console.log(search);
    }, [search, doSearch]);

    const handleSearchSubmit = (e) => {
        setDoSearch(search);
        e.preventDefault();
    };

    const handlePaging = () => {
        setSearch({ ...search, page: search.page ? search.page + 1 : 1 });
    };

    return (
        <div className="Search">
            <header>Header</header>
            <SearchBar
                search={search}
                setSearch={setSearch}
                handleSubmit={handleSearchSubmit}
            />
            <div id="main">
                <FilterBar
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSearchSubmit}
                />
                <PadTable padlist={padlist} />
            </div>
            <PagingComponent
                num={padlist.length}
                total={padnum}
                handlePaging={handlePaging}
            />
        </div>
    );
}

export default SearchComponent;
