import React, { useState, useEffect } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { FilterBar } from "../components/filter";
import { SearchBar } from "../components/search";
import { PadTable } from "../components/padtable";
import { pad_list } from "../query/search";

type PagingComponentProps = { num: number, total: number }
const PagingComponent = ({num, total}: PagingComponentProps) => (
    <div className="paging">
        <div>{num == total ? `${num}` : `${num}/${total}`}</div>
    </div>
 )

function SearchComponent() {
    const [padlist, setPadlist] = useState([]);
    const [padnum, setPadNum] = useState(0);
    const [search, setSearch] = useState({});
    const [doSearch, setDoSearch] = useState(search);
    const sparqlEngine = new QueryEngine();

    useEffect(() => {
        async function render() {
            const { padlist, num } = await pad_list(sparqlEngine, doSearch)
            setPadlist(padlist);
            setPadNum(num);
        }
        render();
    }, [doSearch]);

    useEffect(() => {
        async function render() {
            console.log(search);
        }
        render();
    }, [search]);

    const handleSearchSubmit = (e) => {
        setDoSearch(search);
        console.log(search);
        e.preventDefault();
    };
    const handleRowClick = (id: string) => {
        alert(`goto pad: ${id.replace("pad:", "")}`);
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
                <PadTable padlist={padlist} handleClick={handleRowClick} />
            </div>
            <PagingComponent num={padlist.length} total={padnum} />
        </div>
    );
}

export default SearchComponent;
