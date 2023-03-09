import { Toggles } from "../reducers/search";
import { createAction } from "@reduxjs/toolkit";
export type searchAction = {
    type: string;
    payload?: string | boolean | number | Toggles
};

// Search
export const search_set = createAction<string>('search/set')
export const search_clear = createAction('search/clear')

// Page
export const page_decrement = createAction('page/decrement')
export const page_increment = createAction('page/increment')
export const page_set = createAction<number>('page/set')
export const page_setsize = createAction<number>('page/setsize');
export const page_reset = createAction('page/reset');

// Order
export const order_setprop = createAction<string>('order/setprop');
export const order_toggleasc = createAction('order/toggleasc');
export const order_setasc = createAction<boolean>('order/setasc');

// Creators
export const creators_set = createAction<Toggles>('creators/set');
export const creators_reset = createAction('creators/reset');
export const creators_toggleone = createAction<string>('creators/toggleone');

// Publication Policy
export const publication_toggle = createAction('publication/toggle');
export const publication_copyrightowners_set = createAction<Toggles>('publication/copyrightowners/set');
export const publication_copyrightowners_reset = createAction('publication/copyrightowners/reset');
export const publication_copyrightowners_toggleone = createAction<string>('publication/copyrightowners/toggleone');
export const publication_apc_set = createAction<number>('publication/apc/set');
export const publication_apc_toggle = createAction('publication/apc/toggle');
export const publication_embargo_set = createAction<number>('publication/embargo/set');
export const publication_embargo_toggle = createAction('publication/embargo/toggle');
export const publication_openaccess_toggle = createAction('publication/openaccess/toggle');

// Publication Elsewhere Policy
export const elsewhere_toggle = createAction('elsewhere/toggle');
export const elsewhere_versions_set = createAction<Toggles>('elsewhere/versions/set');
export const elsewhere_versions_reset = createAction('elsewhere/versions/reset');
export const elsewhere_versions_toggleone = createAction<string>('elsewhere/versions/toggleone');
export const elsewhere_locations_set = createAction<Toggles>('elsewhere/location/set');
export const elsewhere_locations_reset = createAction('elsewhere/location/reset');
export const elsewhere_locations_toggleone = createAction<string>('elsewhere/location/toggleone');
export const elsewhere_copyrightowners_set = createAction<Toggles>('elsewhere/copyrightowners/set');
export const elsewhere_copyrightowners_reset = createAction('elsewhere/copyrightowners/reset');
export const elsewhere_copyrightowners_toggleone = createAction<string>('elsewhere/copyrightowners/toggleone');
export const elsewhere_licenses_set = createAction<Toggles>('elsewhere/licenses/set');
export const elsewhere_licenses_reset = createAction('elsewhere/licenses/reset');
export const elsewhere_licenses_toggleone = createAction<string>('elsewhere/licenses/toggleone');
export const elsewhere_embargo_set = createAction<number>('elsewhere/embargo/set');
export const elsewhere_embargo_toggle = createAction('elsewhere/embargo/toggle');

// Evaluation Policy
export const evaluation_toggle = createAction('evaluation/toggle');
export const evaluation_anonymized_set = createAction<string>('evaluation/anonymized/set');
export const evaluation_anonymized_toggle = createAction('evaluation/anonymized/toggle');
export const evaluation_interactions_set = createAction<Toggles>('evaluation/interactions/set');
export const evaluation_interactions_reset = createAction('evaluation/interactions/reset');
export const evaluation_interactions_toggleone = createAction<string>('evaluation/interactions/toggleone');
export const evaluation_information_set = createAction<Toggles>('evaluation/information/set');
export const evaluation_information_reset = createAction('evaluation/information/reset');
export const evaluation_information_toggleone = createAction<string>('evaluation/information/toggleone');
export const evaluation_comments_set = createAction<Toggles>('evaluation/comments/set');
export const evaluation_comments_reset = createAction('evaluation/comments/reset');
export const evaluation_comments_toggleone = createAction<string>('evaluation/comments/toggleone');
