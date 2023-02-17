import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import * as searchActions from "../actions/search";
import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";

type SearchBarProps = {
    handleSubmit: () => void;
};
const SearchBar = ({ handleSubmit }: SearchBarProps) => {
    const state = useAppSelector((state) => state.search.searchstring);
    const [input, setInput] = useState(state)
    useEffect(() => setInput(state), [state])
    const dispatch = useAppDispatch();
    const commit = () => dispatch(searchActions.set_search(input))
    return (
        <Stack id="search-bar" direction="row" spacing={2} mt={2}>
            <TextField
                placeholder="Search by platform information (journal title, ISSN, keywords, etc.)"
                value={input}
                size="small"
                onChange={(e) => setInput(e.target.value)}
                onBlur={() => commit()}
                onKeyDown={(e) => (e.key == "Enter" ? commit() : null)}
                onKeyUp={(e) => (e.key == "Enter" ? handleSubmit() : null)}
                fullWidth
            />
            <Button onClick={handleSubmit} variant="contained">
                Search
            </Button>
            <Button
                variant="outlined"
                onMouseDown={() => dispatch(searchActions.clear())}
                onMouseUp={handleSubmit}
            >
                Clear
            </Button>
        </Stack>
    );
};

export { SearchBar };
