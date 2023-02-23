import { useAppSelector } from "../store";

export type padsAction = {
    type: string;
    payload?: padsActionPayload;
};
type padsActionPayload = {
    pads?: Array<object>,
    value?: number
};

export const CLEAR = "clear";
export const ADD_PADS = "addPads"
export const SET_PADS = "setPads"
export const SET_TOTAL = "setTotal"
export const SORT_PADS = "sortPads"

export const clear = (): padsAction => ({
    type: CLEAR,
});
export const add_pads = (pads: Array<object>): padsAction => ({
    type: ADD_PADS,
    payload: {
        pads: pads,
    },
});
export const set_pads = (pads: Array<object>, asc = true): padsAction => ({
    type: SET_PADS,
    payload: {
        pads: pads,
        value: asc ? 1 : -1
    },
});
export const set_total = (total: number): padsAction => ({
    type: SET_TOTAL,
    payload: {
        value: total,
    },
});
export const sort_pads = (asc: boolean): padsAction => ({
    type: SET_PADS,
    payload: {
        value: asc ? 1 : 0
    },
});
