import * as actions from "../actions/search"

export type SearchState = {
    searchstring?: string;
    embargo?: boolean;
    embargoduration?: number;
    pubpolicy?: boolean;
    paywall?: boolean;
    pagesize?: number;
};

const initSearch: SearchState = {
    searchstring: "",
    embargo: false,
    embargoduration: 0,
    pubpolicy: false,
    paywall: false,
    pagesize: 20,
};

const searchReducer = (state = initSearch, action: actions.searchAction) => {
    switch (action.type) {
        case actions.CLEAR:
            return initSearch
        case actions.SET_EMBARGO:
            return {...state, embargoduration: Number(action.payload.value) }
        case actions.SET_PAGESIZE:
            return {...state, pagesize: Number(action.payload.value) }
        case actions.SET_SEARCH:
            return {...state, searchstring: String(action.payload.value)}
        case actions.TOGGLE_EMBARGO:
            return {...state, embargo: !state.embargo }
        case actions.TOGGLE_PAYWALL:
            return {...state, paywall: !state.paywall }
        case actions.TOGGLE_PUBPOLICY:
            return {...state, pubpolicy: !state.pubpolicy }
        default:
            return state
   }
};

export default searchReducer
