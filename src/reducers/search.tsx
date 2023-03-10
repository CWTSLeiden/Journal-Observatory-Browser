import { createReducer } from "@reduxjs/toolkit";
import * as actions from "../actions/search"

export type Toggles = { [key: string]: boolean }

export const enabledToggles = (t: Toggles) =>
    Object.entries(t).filter(([,v]) => v).map(([k,]) => k)

function toggleProp(toggles: Toggles, prop: string | boolean | number): Toggles {
    const new_toggles = {...toggles}
    const str_prop = String(prop)
    new_toggles[str_prop] = !new_toggles[str_prop]
    return new_toggles
}


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

const SearchReducer = createReducer(initSearch, (builder) => {
    builder
    // Search
        .addCase(actions.search_set,
            (state, action) => {state.searchstring = action.payload})
        .addCase(actions.search_clear,
            () => initSearch )
    // Page
        .addCase(actions.page_decrement,
            (state) => { state.page = Math.max(state.page - 1, 0) })
        .addCase(actions.page_increment,
            (state) => { state.page = state.page + 1 })
        .addCase(actions.page_set,
            (state, action) => { state.page = Number(action.payload) })
        .addCase(actions.page_setsize,
            (state, action) => { state.pagesize = Number(action.payload) })
        .addCase(actions.page_reset,
            (state) => { state.page = initSearch.page })
    // Order
        .addCase(actions.order_setprop,
            (state, action) => { state.orderprop = String(action.payload) })
        .addCase(actions.order_toggleasc,
            (state) => { state.orderasc = !state.orderasc })
        .addCase(actions.order_setasc,
            (state, action) => { state.orderasc = Boolean(action.payload) })
    // Creators
        .addCase(actions.creators_set,
            (state, action) => { state.creators = action.payload })
        .addCase(actions.creators_toggleone,
            (state, action) => { state.creators[action.payload] = !state.creators[action.payload]})
        .addCase(actions.creators_reset,
            (state) => { state.creators = initSearch.creators })
    // Publication Policy
        .addCase(actions.publication_toggle,
            (state) => { state.pub_policy = !state.pub_policy })
        .addCase(actions.publication_copyrightowners_set,
            (state, action) => { state.pub_copyrightowners = action.payload})
        .addCase(actions.publication_copyrightowners_toggleone,
            (state, action) => { state.pub_copyrightowners = toggleProp(state.pub_copyrightowners, action.payload)})
        .addCase(actions.publication_copyrightowners_reset,
            (state) => { state.pub_copyrightowners = initSearch.pub_copyrightowners})
        .addCase(actions.publication_apc_set,
            (state, action) => { state.pub_apcamount = Number(action.payload) })
        .addCase(actions.publication_apc_toggle,
            (state) => { state.pub_apc = !state.pub_apc })
        .addCase(actions.publication_embargo_set,
            (state, action) => { state.pub_embargoduration = Number(action.payload) })
        .addCase(actions.publication_embargo_toggle,
            (state) => { state.pub_embargo = !state.pub_embargo })
        .addCase(actions.publication_openaccess_toggle,
            (state) => { state.open_access = !state.open_access })
    // Publication Elsewhere Policy
        .addCase(actions.elsewhere_toggle,
            (state) => { state.elsewhere_policy = !state.elsewhere_policy })
        .addCase(actions.elsewhere_versions_set,
            (state, action) => { state.elsewhere_versions = action.payload})
        .addCase(actions.elsewhere_versions_toggleone,
            (state, action) => { state.elsewhere_versions = toggleProp(state.elsewhere_versions, action.payload)})
        .addCase(actions.elsewhere_versions_reset,
            (state) => { state.elsewhere_versions = initSearch.elsewhere_versions})
        .addCase(actions.elsewhere_locations_set,
            (state, action) => { state.elsewhere_locations = action.payload})
        .addCase(actions.elsewhere_locations_toggleone,
            (state, action) => { state.elsewhere_locations = toggleProp(state.elsewhere_locations, action.payload)})
        .addCase(actions.elsewhere_locations_reset,
            (state) => { state.elsewhere_locations = initSearch.elsewhere_locations})
        .addCase(actions.elsewhere_copyrightowners_set,
            (state, action) => { state.elsewhere_copyrightowners = action.payload})
        .addCase(actions.elsewhere_copyrightowners_toggleone,
            (state, action) => { state.elsewhere_copyrightowners = toggleProp(state.elsewhere_copyrightowners, action.payload)})
        .addCase(actions.elsewhere_copyrightowners_reset,
            (state) => { state.elsewhere_copyrightowners = initSearch.elsewhere_copyrightowners})
        .addCase(actions.elsewhere_licenses_set,
            (state, action) => { state.elsewhere_licenses = action.payload})
        .addCase(actions.elsewhere_licenses_toggleone,
            (state, action) => { state.elsewhere_licenses = toggleProp(state.elsewhere_licenses, action.payload)})
        .addCase(actions.elsewhere_licenses_reset,
            (state) => { state.elsewhere_licenses = initSearch.elsewhere_licenses})
        .addCase(actions.elsewhere_embargo_set,
            (state, action) => { state.elsewhere_embargoduration = Number(action.payload) })
        .addCase(actions.elsewhere_embargo_toggle,
            (state) => { state.elsewhere_embargo = !state.elsewhere_embargo })
    // Evaluation Policy
        .addCase(actions.evaluation_toggle,
            (state) => { state.evaluation_policy = !state.evaluation_policy })
        .addCase(actions.evaluation_anonymized_set,
            (state, action) => { state.evaluation_anonymized = action.payload})
        .addCase(actions.evaluation_anonymized_toggleone,
            (state, action) => { state.evaluation_anonymized = toggleProp(state.evaluation_anonymized, action.payload)})
        .addCase(actions.evaluation_anonymized_reset,
            (state) => { state.evaluation_anonymized = initSearch.evaluation_anonymized})
        .addCase(actions.evaluation_interactions_set,
            (state, action) => { state.evaluation_interactions = action.payload})
        .addCase(actions.evaluation_interactions_toggleone,
            (state, action) => { state.evaluation_interactions = toggleProp(state.evaluation_interactions, action.payload)})
        .addCase(actions.evaluation_interactions_reset,
            (state) => { state.evaluation_interactions = initSearch.evaluation_interactions})
        .addCase(actions.evaluation_information_set,
            (state, action) => { state.evaluation_information = action.payload})
        .addCase(actions.evaluation_information_toggleone,
            (state, action) => { state.evaluation_information = toggleProp(state.evaluation_information, action.payload)})
        .addCase(actions.evaluation_information_reset,
            (state) => { state.evaluation_information = initSearch.evaluation_information})
        .addCase(actions.evaluation_comments_set,
            (state, action) => { state.evaluation_comments = action.payload})
        .addCase(actions.evaluation_comments_toggleone,
            (state, action) => { state.evaluation_comments = toggleProp(state.evaluation_comments, action.payload)})
        .addCase(actions.evaluation_comments_reset,
            (state) => { state.evaluation_comments = initSearch.evaluation_comments})
    //
        .addDefaultCase((state) => state)
})

export default SearchReducer
