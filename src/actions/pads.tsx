import { createAction } from "@reduxjs/toolkit";

export type padsAction = {
    type: string;
    payload?: object[] | number;
};

export const pads_clear = createAction('pads/clear')
export const pads_add = createAction<object[]>('pads/add')
export const pads_set = createAction<object[]>('pads/set')
export const pads_order = createAction<boolean>('pads/order')
export const total_set = createAction<number>('total/set')
