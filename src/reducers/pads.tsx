import { createReducer } from "@reduxjs/toolkit";
import * as actions from "../actions/pads";

export type PadsState = {
    pads: Array<object>;
    total: number;
};

const initPads: PadsState = {
    pads: [],
    total: 0,
};

export const order_pads = (pads: Array<object>, asc?: boolean) => {
    const direction = (asc || asc == undefined) ? 1 : -1
    const ord = (a: object) => a["ppo:_ord"] || ""
    const ordering = (a: object, b: object) =>
        (ord(a) > ord(b) ? 1 : -1) * direction
    pads.sort(ordering)
    return pads
}

const PadsReducer = createReducer(initPads, (builder) => {
    builder
        .addCase(actions.pads_clear,
            () => initPads)
        .addCase(actions.pads_add,
            (state, action) => { state.pads = state.pads.concat(action.payload) })
        .addCase(actions.pads_set,
            (state, action) => { state.pads = action.payload })
        .addCase(actions.pads_order,
            (state, action) => { state.pads = order_pads(state.pads, action.payload) })
        .addCase(actions.total_set,
            (state, action) => { state.total = action.payload })
})

export default PadsReducer
