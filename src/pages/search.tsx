import React, { useState, useEffect, ChangeEvent, ReactNode } from "react";
import { LinkItUrl } from "react-linkify-it";
import { QueryEngine } from "@comunica/query-sparql";
import { normalize_graph, query_jsonld, query_select } from "../query/query";
import { FilterBar } from "../components/filter"
import { SearchBar, SearchState } from "../components/search"

type PadTableProps = {
    padlist: Array<object>;
    handleClick: (id: string) => void;
};
const PadTable = ({ padlist, handleClick }: PadTableProps) => (
    <table id="results">
        <thead>
            <tr className="table-head">
                <th>Names</th>
                <th>Identifiers</th>
                <th>Keywords</th>
            </tr>
        </thead>
        <tbody>
            {padlist.map((pad) => (
                <PadRow key={pad["@id"]} pad={pad} handleClick={handleClick} />
            ))}
        </tbody>
    </table>
);

type PadRowProps = { pad: object; handleClick: (id: string) => void };
const PadRow = ({ pad, handleClick }: PadRowProps) => (
    <tr onClick={() => handleClick(pad["@id"])}>
        <td>
            {pad["schema:name"] ? pad["schema:name"].find(Boolean) : "<null>"}
        </td>
        <td>
            {pad["dcterms:identifier"]
                ? pad["dcterms:identifier"].join(", ")
                : "<null>"}
        </td>
        <td>
            {pad["ppo:hasKeyword"]
                ? pad["ppo:hasKeyword"].join(", ")
                : "<null>"}
        </td>
    </tr>
);

function SearchComponent() {
    const [padlist, setPadlist] = useState([]);
    const [search, setSearch] = useState({});
    const [doSearch, setDoSearch] = useState(search);
    const sparqlEngine = new QueryEngine();

    useEffect(() => {
        async function render() {
            setPadlist(await pad_list(sparqlEngine, doSearch));
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
        </div>
    );
}

async function pad_list(engine: QueryEngine, search: SearchState) {
    const query = `
        construct {
            ?pad dcterms:identifier ?sid ;
                schema:name ?name ;
                ppo:hasKeyword ?keyword ;
        }
        where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion {
                ?platform a ppo:Platform . 
            }
            filter exists {
                optional { ?platform schema:name ?name . }
                optional { ?platform dcterms:identifier ?id . }
                optional { ?platform ppo:hasKeyword ?keyword . } 
                filter(contains(lcase(str(?name)), lcase(?search))
                    || contains(lcase(str(?id)), lcase(?search))
                    || contains(lcase(str(?keyword)), lcase(?search))
                ) 
            }
            optional { ?platform schema:name ?name . }
            optional { ?platform dcterms:identifier ?id . bind(str(?id) as ?sid) . }
            optional { ?platform ppo:hasKeyword ?keyword . }
        }
        values (?search) {("${search.searchstring || ""}")}
    `;
    return normalize_graph(await query_jsonld(query, engine));
}

export default SearchComponent;
