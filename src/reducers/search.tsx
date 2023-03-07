import * as actions from "../actions/search"

export type Toggles = { [key: string]: boolean }
export const enabledToggles = (t: Toggles) =>
    Object.entries(t).filter(([,v]) => v).map(([k,]) => k)

export type SearchState = {
    creators?: Toggles;
    elsewhere_articleversion?: Toggles;
    elsewhere_copyrightowner?: Toggles;
    elsewhere_embargo?: boolean;
    elsewhere_embargoduration?: number;
    elsewhere_license?: Toggles;
    elsewhere_location?: Toggles;
    elsewhere_policy?: boolean;
    evaluation_policy?: boolean;
    open_access?: boolean;
    orderasc?: boolean;
    orderprop?: string;
    page?: number;
    pagesize?: number;
    pub_apc?: boolean;
    pub_apcamount?: number;
    pub_embargo?: boolean;
    pub_embargoduration?: number;
    pub_licenses?: Toggles;
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
    pub_licenses: {
        "cc0": false,
        "cc-by": false,
        "cc-by-nc": false,
        "cc-by-nc-nd": false,
        "cc-by-nc-sa": false,
        "cc-by-nd": false,
        "cc-by-sa": false
    },
    pub_policy: false,
    searchstring: ""
};

function toggleProp(toggles: Toggles, prop: string | boolean | number): Toggles {
    const new_toggles = {...toggles}
    const str_prop = String(prop)
    new_toggles[str_prop] = !new_toggles[str_prop]
    return new_toggles
}

const SearchReducer = (state = initSearch, action: actions.searchAction) => {
    switch (action.type) {
        case actions.CLEAR: return initSearch
        case actions.DECREMENT_PAGE: return {...state, page: Math.max(state.page - 1, 0) }
        case actions.INCREMENT_PAGE: return {...state, page: state.page + 1 }
        case actions.RESET_PAGE: return {...state, page: initSearch.page }
        case actions.RESET_CREATORS: return {...state, creators: initSearch.creators }
        case actions.RESET_PUB_LICENSES: return {...state, pub_licenses: initSearch.pub_licenses}
        case actions.SET_CREATORS: return {...state, creators: action.payload.toggles }
        case actions.SET_PUB_LICENSES: return {...state, pub_licenses: action.payload.toggles}
        case actions.SET_ORDER_ASC: return {...state, orderasc: Boolean(action.payload.value) }
        case actions.SET_ORDER_PROP: return {...state, oderprop: String(action.payload.value) }
        case actions.SET_PAGE: return {...state, page: Number(action.payload.value) }
        case actions.SET_PAGESIZE: return {...state, pagesize: Number(action.payload.value) }
        case actions.SET_PUB_EMBARGO: return {...state, pub_embargoduration: Number(action.payload.value) }
        case actions.SET_PUB_APC: return {...state, pub_apcamount: Number(action.payload.value) }
        case actions.SET_SEARCH: return {...state, searchstring: String(action.payload.value)}
        case actions.TOGGLE_CREATOR: return {...state, creators: toggleProp(state.creators, action.payload.value)}
        case actions.TOGGLE_PUB_LICENSE: return {...state, pub_licenses: toggleProp(state.pub_licenses, action.payload.value)}
        case actions.TOGGLE_OPEN_ACCESS: return {...state, open_access: !state.open_access }
        case actions.TOGGLE_ORDER_ASC: return {...state, orderasc: !state.orderasc }
        case actions.TOGGLE_PUB_EMBARGO: return {...state, pub_embargo: !state.pub_embargo }
        case actions.TOGGLE_PUB_APC: return {...state, pub_apc: !state.pub_apc }
        case actions.TOGGLE_PUB_POLICY: return {...state, pub_policy: !state.pub_policy }
        default: return state
   }
};

export default SearchReducer
