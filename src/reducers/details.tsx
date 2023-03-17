import { createReducer } from "@reduxjs/toolkit";
import * as actions from "../actions/details"

export type Sources = {[id: string]: object}

export type DetailsState = {
    sidebar: boolean;
    sources: Sources;
    sources_disabled: string[];
}

const initDetails: DetailsState = {
    sidebar: true,
    sources: {},
    sources_disabled: []
}

const DetailsReducer = createReducer(initDetails, (builder) => {
    builder
        .addCase(actions.sidebar_toggle,
            (state) => {state.sidebar = !state.sidebar})
        .addCase(actions.sidebar_set,
            (state, action) => {state.sidebar = action.payload})
        .addCase(actions.sources_set,
            (state, action) => {state.sources = action.payload})
        .addCase(actions.source_enable,
            (state, action) => {state.sources_disabled = state.sources_disabled.filter((source) => source !== action.payload)})
        .addCase(actions.source_disable,
            (state, action) => {state.sources_disabled.push(action.payload)})
})

export default DetailsReducer
