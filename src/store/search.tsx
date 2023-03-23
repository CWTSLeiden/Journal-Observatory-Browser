import { createAction, createReducer } from "@reduxjs/toolkit";

// Types
export type Toggles = { [key: string]: boolean }

export type SearchState = {
    searchstring?: string;
    page?: number;
    pagesize?: number;
    orderasc?: boolean;
    orderprop?: string;
    creators?: Toggles;
    pub_policy: boolean;
    pub_apc?: boolean;
    pub_apcamount?: number;
    pub_copyrightowners?: Toggles;
    pub_embargo?: boolean;
    pub_embargoduration?: number;
    pub_licenses?: Toggles;
    open_access?: boolean;
    elsewhere_policy?: boolean;
    elsewhere_versions?: Toggles;
    elsewhere_locations?: Toggles;
    elsewhere_licenses?: Toggles;
    elsewhere_copyrightowners?: Toggles;
    elsewhere_embargo?: boolean;
    elsewhere_embargoduration?: number;
    evaluation_policy?: boolean;
    evaluation_anonymized?: Toggles;
    evaluation_interactions?: Toggles;
    evaluation_information?: Toggles;
    evaluation_comments?: Toggles;
};

// Actions
export type searchAction = {
    type: string;
    payload?: string | boolean | number | Toggles
};

/// Search
export const search_set = createAction<string>('search/set')
export const search_clear = createAction('search/clear')

/// All Filters
export const filter_clear = createAction('filter/clear')

/// Page
export const page_decrement = createAction('page/decrement')
export const page_increment = createAction('page/increment')
export const page_set = createAction<number>('page/set')
export const page_setsize = createAction<number>('page/setsize');
export const page_reset = createAction('page/reset');

/// Order
export const order_setprop = createAction<string>('order/setprop');
export const order_toggleasc = createAction('order/toggleasc');
export const order_setasc = createAction<boolean>('order/setasc');

/// Creators
export const creators_set = createAction<Toggles>('creators/set');
export const creators_reset = createAction('creators/reset');
export const creators_toggleone = createAction<string>('creators/toggleone');

/// Publication Policy
export const publication_toggle = createAction('publication/toggle');
export const publication_copyrightowners_set = createAction<Toggles>('publication/copyrightowners/set');
export const publication_copyrightowners_reset = createAction('publication/copyrightowners/reset');
export const publication_copyrightowners_toggleone = createAction<string>('publication/copyrightowners/toggleone');
export const publication_apc_set = createAction<number>('publication/apc/set');
export const publication_apc_toggle = createAction('publication/apc/toggle');
export const publication_embargo_set = createAction<number>('publication/embargo/set');
export const publication_embargo_toggle = createAction('publication/embargo/toggle');
export const publication_licenses_set = createAction<Toggles>('publication/licenses/set');
export const publication_licenses_reset = createAction('publication/licenses/reset');
export const publication_licenses_toggleone = createAction<string>('publication/licenses/toggleone');
export const publication_openaccess_toggle = createAction('publication/openaccess/toggle');

/// Publication Elsewhere Policy
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

/// Evaluation Policy
export const evaluation_toggle = createAction('evaluation/toggle');
export const evaluation_anonymized_set = createAction<Toggles>('evaluation/anonymized/set');
export const evaluation_anonymized_reset = createAction('evaluation/anonymized/reset');
export const evaluation_anonymized_toggleone = createAction<string>('evaluation/anonymized/toggleone');
export const evaluation_interactions_set = createAction<Toggles>('evaluation/interactions/set');
export const evaluation_interactions_reset = createAction('evaluation/interactions/reset');
export const evaluation_interactions_toggleone = createAction<string>('evaluation/interactions/toggleone');
export const evaluation_information_set = createAction<Toggles>('evaluation/information/set');
export const evaluation_information_reset = createAction('evaluation/information/reset');
export const evaluation_information_toggleone = createAction<string>('evaluation/information/toggleone');
export const evaluation_comments_set = createAction<Toggles>('evaluation/comments/set');
export const evaluation_comments_reset = createAction('evaluation/comments/reset');
export const evaluation_comments_toggleone = createAction<string>('evaluation/comments/toggleone');

// Utility
export const enabledToggles = (t: Toggles) =>
    Object.entries(t).filter(([,v]) => v).map(([k,]) => k)

const toggleProp = (toggles: Toggles, prop: string | boolean | number): Toggles => {
    const new_toggles = {...toggles}
    const str_prop = String(prop)
    new_toggles[str_prop] = !new_toggles[str_prop]
    return new_toggles
}

// Reducer
const initSearch: SearchState = {
    searchstring: "",
    orderasc: true,
    orderprop: "schema:name",
    page: 0,
    pagesize: 20,
    creators: {
        "https://doaj.org": false,
        "https://v2.sherpa.ac.uk/romeo": false,
        "https://www.wikidata.org": false,
        "https://openalex.org": false,
        "https://www.ieee.org": false,
        "https://springernature.com": false,
        "https://www.wiley.com": false,
        "https://elifesciences.org": false,
    },
    pub_policy: false,
    pub_embargo: false,
    pub_embargoduration: 0,
    pub_apc: false,
    pub_apcamount: 0,
    pub_copyrightowners: {
        "pro:author": false,
        "pro:publisher": false
    },
    pub_licenses: {
        "https://creativecommons.org/publicdomain/zero/1.0/": false,
        "https://creativecommons.org/licenses/by/4.0/": false,
        "https://creativecommons.org/licenses/by-nc/4.0/": false,
        "https://creativecommons.org/licenses/by-nc-nd/4.0/": false,
        "https://creativecommons.org/licenses/by-nc-sa/4.0/": false,
        "https://creativecommons.org/licenses/by-nd/4.0/": false,
        "https://creativecommons.org/licenses/by-sa/4.0/": false
    },
    open_access: false,
    elsewhere_policy: false,
    elsewhere_versions: {
        "pso:submitted": false,
        "pso:accepted-for-publication": false,
        "pso:published": false
    },
    elsewhere_locations: {
        "non_commercial_institutional_repository": false,
        "non_commercial_subject_repository": false,
        "non_commercial_social_network": false,
        "this_journal": false,
        "named_repository": false,
        "any_website": false,
        "preprint_repository": false,
        "institutional_website": false,
        "named_academic_social_network": false,
        "any_repository": false,
        "non_commercial_repository": false,
        "non_commercial_website": false,
        "institutional_repository": false,
        "authors_homepage": false,
        "funder_designated_location": false,
        "subject_repository": false,
        "academic_social_network": false,
    },
    elsewhere_copyrightowners: {
        "pro:author": false,
        "pro:publisher": false
    },
    elsewhere_licenses: {
        "https://creativecommons.org/publicdomain/zero/1.0/": false,
        "https://creativecommons.org/licenses/by/4.0/": false,
        "https://creativecommons.org/licenses/by-nc/4.0/": false,
        "https://creativecommons.org/licenses/by-nc-nd/4.0/": false,
        "https://creativecommons.org/licenses/by-nc-sa/4.0/": false,
        "https://creativecommons.org/licenses/by-nd/4.0/": false,
        "https://creativecommons.org/licenses/by-sa/4.0/": false
    },
    elsewhere_embargo: false,
    elsewhere_embargoduration: 0,
    evaluation_policy: false,
    evaluation_anonymized: {
        "all": false,
        "single": false,
        "double": false,
        "triple": undefined
    },
    evaluation_interactions: {
        "pro:editor": false,
        "pro:peer-reviewer": undefined,
        "pro:author": false
    },
    evaluation_information: {
        "ppo:ReviewReport": false,
        "ppo:ReviewSummary": false,
        "ppo:SubmittedManuscript": undefined,
        "ppo:AuthorEditorCommunication": false
    },
    evaluation_comments: {
        "ppo:postPublicationCommentingOpen": false,
        "ppo:postPublicationCommentingOnInvitation": undefined,
        "ppo:postPublicationCommentingClosed": false
    }
};

const initFilters = (state: SearchState) => ({
    ...initSearch,
    searchstring: state.searchstring,
    orderasc: state.orderasc,
    orderprop: state.orderprop,
    page: state.page,
    pagesize: state.pagesize
})

const SearchReducer = createReducer(initSearch, (builder) => {
    builder
    // Search
        .addCase(search_set,
            (state, action) => {state.searchstring = action.payload})
        .addCase(search_clear,
            (state) => {state.searchstring = initSearch.searchstring})
    // Filter
        .addCase(filter_clear,
            (state) => initFilters(state))
    // Page
        .addCase(page_decrement,
            (state) => { state.page = Math.max(state.page - 1, 0) })
        .addCase(page_increment,
            (state) => { state.page = state.page + 1 })
        .addCase(page_set,
            (state, action) => { state.page = Number(action.payload) })
        .addCase(page_setsize,
            (state, action) => { state.pagesize = Number(action.payload) })
        .addCase(page_reset,
            (state) => { state.page = initSearch.page })
    // Order
        .addCase(order_setprop,
            (state, action) => { state.orderprop = String(action.payload) })
        .addCase(order_toggleasc,
            (state) => { state.orderasc = !state.orderasc })
        .addCase(order_setasc,
            (state, action) => { state.orderasc = Boolean(action.payload) })
    // Creators
        .addCase(creators_set,
            (state, action) => { state.creators = action.payload })
        .addCase(creators_toggleone,
            (state, action) => { state.creators[action.payload] = !state.creators[action.payload]})
        .addCase(creators_reset,
            (state) => { state.creators = initSearch.creators })
    // Publication Policy
        .addCase(publication_toggle,
            (state) => { state.pub_policy = !state.pub_policy })
        .addCase(publication_copyrightowners_set,
            (state, action) => { state.pub_copyrightowners = action.payload})
        .addCase(publication_copyrightowners_toggleone,
            (state, action) => { state.pub_copyrightowners = toggleProp(state.pub_copyrightowners, action.payload)})
        .addCase(publication_copyrightowners_reset,
            (state) => { state.pub_copyrightowners = initSearch.pub_copyrightowners})
        .addCase(publication_apc_set,
            (state, action) => { state.pub_apcamount = Number(action.payload) })
        .addCase(publication_apc_toggle,
            (state) => { state.pub_apc = !state.pub_apc })
        .addCase(publication_embargo_set,
            (state, action) => { state.pub_embargoduration = Number(action.payload) })
        .addCase(publication_embargo_toggle,
            (state) => { state.pub_embargo = !state.pub_embargo })
        .addCase(publication_licenses_set,
            (state, action) => { state.pub_licenses = action.payload})
        .addCase(publication_licenses_toggleone,
            (state, action) => { state.pub_licenses = toggleProp(state.pub_licenses, action.payload)})
        .addCase(publication_licenses_reset,
            (state) => { state.pub_licenses = initSearch.pub_licenses})
        .addCase(publication_openaccess_toggle,
            (state) => { state.open_access = !state.open_access })
    // Publication Elsewhere Policy
        .addCase(elsewhere_toggle,
            (state) => { state.elsewhere_policy = !state.elsewhere_policy })
        .addCase(elsewhere_versions_set,
            (state, action) => { state.elsewhere_versions = action.payload})
        .addCase(elsewhere_versions_toggleone,
            (state, action) => { state.elsewhere_versions = toggleProp(state.elsewhere_versions, action.payload)})
        .addCase(elsewhere_versions_reset,
            (state) => { state.elsewhere_versions = initSearch.elsewhere_versions})
        .addCase(elsewhere_locations_set,
            (state, action) => { state.elsewhere_locations = action.payload})
        .addCase(elsewhere_locations_toggleone,
            (state, action) => { state.elsewhere_locations = toggleProp(state.elsewhere_locations, action.payload)})
        .addCase(elsewhere_locations_reset,
            (state) => { state.elsewhere_locations = initSearch.elsewhere_locations})
        .addCase(elsewhere_copyrightowners_set,
            (state, action) => { state.elsewhere_copyrightowners = action.payload})
        .addCase(elsewhere_copyrightowners_toggleone,
            (state, action) => { state.elsewhere_copyrightowners = toggleProp(state.elsewhere_copyrightowners, action.payload)})
        .addCase(elsewhere_copyrightowners_reset,
            (state) => { state.elsewhere_copyrightowners = initSearch.elsewhere_copyrightowners})
        .addCase(elsewhere_licenses_set,
            (state, action) => { state.elsewhere_licenses = action.payload})
        .addCase(elsewhere_licenses_toggleone,
            (state, action) => { state.elsewhere_licenses = toggleProp(state.elsewhere_licenses, action.payload)})
        .addCase(elsewhere_licenses_reset,
            (state) => { state.elsewhere_licenses = initSearch.elsewhere_licenses})
        .addCase(elsewhere_embargo_set,
            (state, action) => { state.elsewhere_embargoduration = Number(action.payload) })
        .addCase(elsewhere_embargo_toggle,
            (state) => { state.elsewhere_embargo = !state.elsewhere_embargo })
    // Evaluation Policy
        .addCase(evaluation_toggle,
            (state) => { state.evaluation_policy = !state.evaluation_policy })
        .addCase(evaluation_anonymized_set,
            (state, action) => { state.evaluation_anonymized = action.payload})
        .addCase(evaluation_anonymized_toggleone,
            (state, action) => { state.evaluation_anonymized = toggleProp(state.evaluation_anonymized, action.payload)})
        .addCase(evaluation_anonymized_reset,
            (state) => { state.evaluation_anonymized = initSearch.evaluation_anonymized})
        .addCase(evaluation_interactions_set,
            (state, action) => { state.evaluation_interactions = action.payload})
        .addCase(evaluation_interactions_toggleone,
            (state, action) => { state.evaluation_interactions = toggleProp(state.evaluation_interactions, action.payload)})
        .addCase(evaluation_interactions_reset,
            (state) => { state.evaluation_interactions = initSearch.evaluation_interactions})
        .addCase(evaluation_information_set,
            (state, action) => { state.evaluation_information = action.payload})
        .addCase(evaluation_information_toggleone,
            (state, action) => { state.evaluation_information = toggleProp(state.evaluation_information, action.payload)})
        .addCase(evaluation_information_reset,
            (state) => { state.evaluation_information = initSearch.evaluation_information})
        .addCase(evaluation_comments_set,
            (state, action) => { state.evaluation_comments = action.payload})
        .addCase(evaluation_comments_toggleone,
            (state, action) => { state.evaluation_comments = toggleProp(state.evaluation_comments, action.payload)})
        .addCase(evaluation_comments_reset,
            (state) => { state.evaluation_comments = initSearch.evaluation_comments})
    //
        .addDefaultCase((state) => state)
})

export default SearchReducer
