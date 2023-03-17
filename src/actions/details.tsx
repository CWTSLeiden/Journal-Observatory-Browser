import { Sources } from "../reducers/details"
import { createAction } from "@reduxjs/toolkit";

export type detailsAction = {
    type: string;
    payload?: string | boolean | number | Sources
}

export const sidebar_toggle = createAction('sidebar/toggle')
export const sidebar_set = createAction<boolean>('sidebar/set')

export const sources_set = createAction<Sources>('sources/set')
export const source_enable = createAction<string>('source/enable')
export const source_disable = createAction<string>('source/disable')
