import React, { ChangeEvent } from "react";

type SearchState = {
    searchstring?: string;
    embargo?: boolean;
    embargoduration?: number;
    pubpolicy?: boolean;
    paywall?: boolean;
    pagesize?: number;
    page?: number;
};

type SearchBarProps = {
    search: SearchState;
    setSearch: (search: SearchState) => void;
    handleSubmit: React.UIEventHandler;
};
const SearchBar = ({ search, setSearch, handleSubmit }: SearchBarProps) => (
    <div id="searchbar">
        <label htmlFor="search">Search</label>
        <input
            value={search.searchstring || ""}
            type="text"
            id="search"
            name="search"
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch({ ...search, searchstring: e.target.value })
            }
            onKeyUp={(e) => {
                if (e.key == "Enter") {
                    handleSubmit(e);
                }
            }}
        />
        <button onClick={handleSubmit}>Search</button>
        <button
            onMouseDown={() => {
                setSearch({ searchstring: "" });
            }}
            onMouseUp={handleSubmit}
        >
            Clear
        </button>
    </div>
);

export { SearchState, SearchBar }
