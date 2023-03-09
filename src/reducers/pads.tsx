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

const order_pads = (pads: Array<object>, asc: boolean) => {
    const direction = asc ? 1 : -1
    const ordering = (a: object, b: object) =>
        ((a["ppo:_ord"] || "") > (b["ppo:_ord"] || "") ? 1 : -1) * direction
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
