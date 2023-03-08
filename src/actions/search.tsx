import { Toggles } from "../reducers/search";
import { createAction } from "@reduxjs/toolkit";
export type searchAction = {
    type: string;
    payload?: string | boolean | number | Toggles
};

// Search
export const set_search = createAction<string>('search/set')
export const clear = createAction('clear')

// Page
export const decrement_page = createAction('decrementPage')
export const increment_page = createAction('incrementPage')
export const set_page = createAction<number>('setPage')
export const set_page_size = createAction<number>('setPagesize');
export const reset_page = createAction('resetPage');

// Order
export const set_order_prop = createAction<string>('setOrderProp');
export const toggle_order_asc = createAction('toggleOrderAsc');
export const set_order_asc = createAction<boolean>('setOrderAsc');

// Creators
export const set_creators = createAction<Toggles>('setCreators');
export const toggle_creator = createAction<string>('toggleCreator');
export const reset_creators = createAction('resetCreators');

// Publication Policy
export const toggle_pub_policy = createAction('togglePubPolicy');
export const reset_pub_copyrightowners = createAction('resetPubCopyrightowners');
export const set_pub_copyrightowners = createAction<Toggles>('setPubCopyrightowners');
export const toggle_pub_copyrightowner = createAction<string>('togglePubCopyrightowner');
export const set_pub_apc = createAction<number>('setPubApc');
export const toggle_pub_apc = createAction('togglePubApc');

export const set_pub_embargo = createAction<number>('setPubEmbargo');
export const toggle_pub_embargo = createAction('togglePubEmbargo');

export const toggle_open_access = createAction('toggleOpenAccess');

// Publication Elsewhere Policy
export const reset_elsewhere_licenses = createAction('resetElsewhereLicenses');
export const set_elsewhere_licenses = createAction<Toggles>('setElsewhereLicenses');
export const toggle_elsewhere_license = createAction<string>('toggleElsewhereLicense');

// Evaluation Policy
