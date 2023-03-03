import React, { useContext, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import * as searchActions from "../actions/search";
import { Slider } from "@mui/material";
import { AppContext } from "../context";
import { CheckBoxFilter } from "./filter";

export const PubPolicyFilter = () => {
    const label = useContext(AppContext).labels["ppo:hasPublicationPolicy"] || "has Publication Policy"
    return (
        <CheckBoxFilter
            state={(store) => store.search.pub_policy}
            action={searchActions.toggle_pub_policy}
            label={label}
        />
)}

export const OpenAccessFilter = () => {
    const label = useContext(AppContext).labels["ppo:isOpenAccess"] || "is Open Access"
    return (
        <CheckBoxFilter
            state={(store) => store.search.open_access}
            action={searchActions.toggle_open_access}
            label={label}
        />
)}

export const PubEmbargoFilter = () => {
    const state = useAppSelector((s) => s.search.pub_embargo);
    const value = useAppSelector((s) => s.search.pub_embargoduration);
    const label = useContext(AppContext).labels["fabio:hasEmbargoDuration"] || "has Embargo Duration"
    const [number, setNumber] = useState(value);
    useEffect(() => setNumber(value), [value]);
    const dispatch = useAppDispatch();
    return (
        <CheckBoxFilter
            state={(store) => store.search.pub_embargo}
            action={searchActions.toggle_pub_embargo}
            label={label}
        >
            <Slider
                disabled={!state}
                value={number}
                onChange={(_, n: number) => setNumber(n)}
                onChangeCommitted={(_, n: number) =>
                    dispatch(searchActions.set_pub_embargo(n))
                }
                max={24}
                valueLabelDisplay="auto"
                marks={[0, 6, 12, 18, 24].map((n) => ({
                    value: n,
                    label: `${n}M`,
                }))}
            />
        </CheckBoxFilter>
    );
};
