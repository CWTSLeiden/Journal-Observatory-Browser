import * as actions from "../actions/search"

export type SearchState = {
    searchstring?: string;
    pub_embargo?: boolean;
    pub_embargoduration?: number;
    orderprop?: string;
    orderasc?: boolean;
    pubpolicy?: boolean;
    open_access?: boolean;
    pagesize?: number;
    page?: number;
};

const initSearch: SearchState = {
    searchstring: "",
    pub_embargo: false,
    pub_embargoduration: 0,
    orderprop: "schema:name",
    orderasc: true,
    pubpolicy: false,
    open_access: false,
    pagesize: 20,
    page: 0,
};

const SearchReducer = (state = initSearch, action: actions.searchAction) => {
    switch (action.type) {
        case actions.CLEAR:
            return initSearch
        case actions.SET_PUB_EMBARGO:
            return {...state, pub_embargoduration: Number(action.payload.value) }
        case actions.SET_PAGE:
            return {...state, page: Number(action.payload.value) }
        case actions.DECREMENT_PAGE:
            return {...state, page: Math.max(state.page - 1, 0) }
        case actions.INCREMENT_PAGE:
            return {...state, page: state.page + 1 }
        case actions.RESET_PAGE:
            return {...state, page: 0 }
        case actions.SET_PAGESIZE:
            return {...state, pagesize: Number(action.payload.value) }
        case actions.SET_SEARCH:
            return {...state, searchstring: String(action.payload.value)}
        case actions.SET_ORDER_PROP:
            return {...state, oderprop: String(action.payload.value) }
        case actions.SET_ORDER_ASC:
            return {...state, orderasc: Boolean(action.payload.value) }
        case actions.TOGGLE_ORDER_ASC:
            return {...state, orderasc: !state.orderasc }
        case actions.TOGGLE_PUB_EMBARGO:
            return {...state, pub_embargo: !state.pub_embargo }
        case actions.TOGGLE_OPEN_ACCESS:
            return {...state, open_access: !state.open_access }
        case actions.TOGGLE_PUBPOLICY:
            return {...state, pubpolicy: !state.pubpolicy }
        default:
            return state
   }
};

export default SearchReducer
