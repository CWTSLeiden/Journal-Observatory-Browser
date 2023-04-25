import { createAction, createReducer } from "@reduxjs/toolkit";

// Types
export type padsAction = {
    type: string;
    payload?: {page: number, pads: object[]} | number;
};

export type PadsState = {
    pads: {[page: number]: object[]};
    total: number;
};

// Actions
export const pads_clear = createAction('pads/clear')
export const pads_set = createAction<{page: number, pads: object[]}>('pads/set')
export const pads_order = createAction<{page: number, asc: boolean}>('pads/order')
export const total_set = createAction<number>('total/set')

// Utility
export const order_pads = (pads: Array<object>, asc?: boolean) => {
    const direction = (asc || asc == undefined) ? 1 : -1
    const ord = (a: object) => a["scpo:_ord"] || ""
    const ordering = (a: object, b: object) =>
        (ord(a) > ord(b) ? 1 : -1) * direction
    pads.sort(ordering)
    return pads
}

// Reducer
const initPads: PadsState = {
    pads: {},
    total: 0,
};

const PadsReducer = createReducer(initPads, (builder) => {
    builder
        .addCase(pads_clear,
            () => initPads)
        .addCase(pads_set,
            (state, action) => { state.pads[action.payload.page] = action.payload.pads })
        .addCase(pads_order,
            (state, action) => { state.pads[action.payload.page] = order_pads(state.pads[action.payload.page], action.payload.asc) })
        .addCase(total_set,
            (state, action) => { state.total = action.payload })
})

export default PadsReducer
