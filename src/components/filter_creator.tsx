import React, { useEffect, useState } from "react";
import * as searchActions from "../store/search";
import { useAppDispatch, useAppSelector } from "../store";
import { Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";
import { enabledToggles, Toggles } from "../store/search";
import { labelize } from "../query/labels";

export const CreatorSelect = () => { 
    const creatorstate = useAppSelector(s => s.search.creators);
    const dispatch = useAppDispatch()
    return (
        <MultipleSelect
            label="Sources"
            toggles={creatorstate}
            commit={(state: Toggles) => dispatch(searchActions.creators_set(state)) }
        />)
}

type MultipleSelectProps = {
    label: string;
    toggles: Toggles;
    commit: (state: Toggles) => void
}
export const MultipleSelect = ({label, toggles, commit}: MultipleSelectProps) => {
    const [state, setState] = useState(toggles)
    const render = (selected: Array<string>) => {
        const all = (selected.length == Object.keys(state).length) ? "all" : ""
        return `${all || String(selected.length)} selected`
    }
    const handleChange = (e) => {
        const newstate = {...state}
        Object.keys(state).map(k => newstate[k] = e.target.value.includes(k))
        setState(newstate)
    }
    const handleReset = () => {
        const newstate = {...state}
        Object.keys(state).map(k => newstate[k] = false)
        setState(newstate)
    }
    useEffect(() => setState(toggles), [toggles])
    return (
        <FormControl size="small">
            <InputLabel>{label}</InputLabel>
            <Select
                id="filter-creators-select"
                value={enabledToggles(state)}
                renderValue={render}
                input={<OutlinedInput label={label} />}
                onChange={handleChange}
                onClose={() => commit(state)}
                multiple
            >
                {Object.keys(state).map(key => (
                    <MenuItem key={key} value={key} sx={{pt: "1px", pb: "1px"}}>
                        <Checkbox checked={state[key]} sx={{pr: 3}}/>
                        <ListItemText primary={labelize(key)} />
                    </MenuItem>
                ))}
                <Button
                    onClick={handleReset}
                    sx={{width: "100%", mt: 1}}
                >
                    Clear
                </Button>
            </Select>
        </FormControl>
    )
}
