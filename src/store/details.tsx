import { createAction, createReducer } from "@reduxjs/toolkit";

// Types
export type Sources = {[id: string]: object}

export type DetailsState = {
    sources: Sources;
    sources_disabled: string[];
}

export type detailsAction = {
    type: string;
    payload?: string | boolean | number | Sources
}

// Actions
export const sources_set = createAction<Sources>('sources/set')
export const sources_clear = createAction<Sources>('sources/clear')
export const source_enable = createAction<string>('source/enable')
export const source_disable = createAction<string>('source/disable')

// Reducer
const initDetails: DetailsState = {
    sources: {},
    sources_disabled: []
}

const DetailsReducer = createReducer(initDetails, (builder) => {
    builder
        .addCase(sources_set,
            (state, action) => {state.sources = action.payload})
        .addCase(sources_clear,
            (state) => {state.sources = initDetails.sources})
        .addCase(source_enable,
            (state, action) => {state.sources_disabled = state.sources_disabled.filter((source) => source !== action.payload)})
        .addCase(source_disable,
            (state, action) => {state.sources_disabled.push(action.payload)})
})

export default DetailsReducer
