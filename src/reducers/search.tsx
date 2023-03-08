import { createReducer } from "@reduxjs/toolkit";
import * as actions from "../actions/search"

export type Toggles = { [key: string]: boolean }
export const enabledToggles = (t: Toggles) =>
    Object.entries(t).filter(([,v]) => v).map(([k,]) => k)

export type SearchState = {
    creators?: Toggles;
    elsewhere_articleversions?: Toggles;
    elsewhere_copyrightowners?: Toggles;
    elsewhere_embargo?: boolean;
    elsewhere_embargoduration?: number;
    elsewhere_licenses?: Toggles;
    elsewhere_locations?: Toggles;
    elsewhere_policy?: boolean;
    evaluation_policy?: boolean;
    open_access?: boolean;
    orderasc?: boolean;
    orderprop?: string;
    page?: number;
    pagesize?: number;
    pub_apc?: boolean;
    pub_apcamount?: number;
    pub_copyrightowners?: Toggles;
    pub_embargo?: boolean;
    pub_embargoduration?: number;
    pub_policy: boolean;
    searchstring?: string;
};

const initSearch: SearchState = {
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
    open_access: false,
    orderasc: true,
    orderprop: "schema:name",
    page: 0,
    pagesize: 20,
    pub_embargo: false,
    pub_embargoduration: 0,
    pub_apc: false,
    pub_apcamount: 0,
    pub_copyrightowners: {
        "pro:author": false,
        "pro:publisher": false
    },
    elsewhere_articleversions: {},
    elsewhere_copyrightowners: {},
    elsewhere_embargo: false,
    elsewhere_embargoduration: 0,
    elsewhere_licenses: {
        "cc0": false,
        "cc-by": false,
        "cc-by-nc": false,
        "cc-by-nc-nd": false,
        "cc-by-nc-sa": false,
        "cc-by-nd": false,
        "cc-by-sa": false
    },
    elsewhere_locations: {},
    elsewhere_policy: false,
    pub_policy: false,
    searchstring: ""
};

function toggleProp(toggles: Toggles, prop: string | boolean | number): Toggles {
    const new_toggles = {...toggles}
    const str_prop = String(prop)
    new_toggles[str_prop] = !new_toggles[str_prop]
    return new_toggles
}

const SearchReducer = createReducer(initSearch, (builder) => {
    builder
    // Search
        .addCase(actions.set_search,
            (state, action) => {state.searchstring = action.payload})
        .addCase(actions.clear,
            () => initSearch )
    // Page
        .addCase(actions.decrement_page,
            (state) => { state.page = Math.max(state.page - 1, 0) })
        .addCase(actions.increment_page,
            (state) => { state.page = state.page + 1 })
        .addCase(actions.set_page,
            (state, action) => { state.page = Number(action.payload) })
        .addCase(actions.set_page_size,
            (state, action) => { state.pagesize = Number(action.payload) })
        .addCase(actions.reset_page,
            (state) => { state.page = initSearch.page })
    // Order
        .addCase(actions.set_order_prop,
            (state, action) => { state.orderprop = String(action.payload) })
        .addCase(actions.toggle_order_asc,
            (state) => { state.orderasc = !state.orderasc })
        .addCase(actions.set_order_asc,
            (state, action) => { state.orderasc = Boolean(action.payload) })
    // Creators
        .addCase(actions.set_creators,
            (state, action) => { state.creators = action.payload })
        .addCase(actions.toggle_creator,
            (state, action) => { state.creators = toggleProp(state.creators, action.payload)})
        .addCase(actions.reset_creators,
            (state) => { state.creators = initSearch.creators })
    // Publication Policy
        .addCase(actions.toggle_pub_policy,
            (state) => { state.pub_policy = !state.pub_policy })
        .addCase(actions.set_pub_copyrightowners,
            (state, action) => { state.pub_copyrightowners = action.payload})
        .addCase(actions.toggle_pub_copyrightowner,
            (state, action) => { state.pub_copyrightowners = toggleProp(state.pub_copyrightowners, action.payload)})
        .addCase(actions.reset_pub_copyrightowners,
            (state) => { state.pub_copyrightowners = initSearch.pub_copyrightowners})
        .addCase(actions.set_pub_apc,
            (state, action) => { state.pub_apcamount = Number(action.payload) })
        .addCase(actions.toggle_pub_apc,
            (state) => { state.pub_apc = !state.pub_apc })
        .addCase(actions.set_pub_embargo,
            (state, action) => { state.pub_embargoduration = Number(action.payload) })
        .addCase(actions.toggle_pub_embargo,
            (state) => { state.pub_embargo = !state.pub_embargo })
        .addCase(actions.toggle_open_access,
            (state) => { state.open_access = !state.open_access })
    // Publication Elsewhere Policy
        .addCase(actions.set_elsewhere_licenses,
            (state, action) => { state.elsewhere_licenses = action.payload})
        .addCase(actions.toggle_elsewhere_license,
            (state, action) => { state.elsewhere_licenses = toggleProp(state.elsewhere_licenses, action.payload)})
        .addCase(actions.reset_elsewhere_licenses,
            (state) => { state.elsewhere_licenses = initSearch.elsewhere_licenses})
    // Evaluation Policy
    //
        .addDefaultCase((state) => state)
})

export default SearchReducer
