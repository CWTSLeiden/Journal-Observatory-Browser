import { createAction, createReducer } from "@reduxjs/toolkit";

// Types
export type padsAction = {
    type: string;
    payload?: object[] | number;
};

export type PadsState = {
    pads: Array<object>;
    total: number;
};

// Actions
export const pads_clear = createAction('pads/clear')
export const pads_add = createAction<object[]>('pads/add')
export const pads_set = createAction<object[]>('pads/set')
export const pads_order = createAction<boolean>('pads/order')
export const total_set = createAction<number>('total/set')

// Utility
export const order_pads = (pads: Array<object>, asc?: boolean) => {
    const direction = (asc || asc == undefined) ? 1 : -1
    const ord = (a: object) => a["ppo:_ord"] || ""
    const ordering = (a: object, b: object) =>
        (ord(a) > ord(b) ? 1 : -1) * direction
    pads.sort(ordering)
    return pads
}

// Reducer
const initPads: PadsState = {
    pads: [],
    total: 0,
};

const PadsReducer = createReducer(initPads, (builder) => {
    builder
        .addCase(pads_clear,
            () => initPads)
        .addCase(pads_add,
            (state, action) => { state.pads = state.pads.concat(action.payload) })
        .addCase(pads_set,
            (state, action) => { state.pads = action.payload })
        .addCase(pads_order,
            (state, action) => { state.pads = order_pads(state.pads, action.payload) })
        .addCase(total_set,
            (state, action) => { state.total = action.payload })
})

export default PadsReducer
