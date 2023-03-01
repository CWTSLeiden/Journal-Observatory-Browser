export type searchAction = {
    type: string;
    payload?: searchActionPayload;
};
type searchActionPayload = {
    value: string | boolean | number;
};

export const CLEAR = "clear";
export const SET_EMBARGO = "setEmbargo";
export const SET_PAGESIZE = "setPagesize";
export const SET_PAGE = "setPage";
export const DECREMENT_PAGE = "decrementPage";
export const INCREMENT_PAGE = "incrementPage";
export const RESET_PAGE = "resetPage";
export const SET_SEARCH = "setSearch";
export const SET_ORDER_PROP = "setOrderProp";
export const SET_ORDER_ASC = "setOrderAsc";
export const TOGGLE_ORDER_ASC = "toggleOrderAsc";
export const TOGGLE_EMBARGO = "toggleEmbargo";
export const TOGGLE_OPEN_ACCESS = "toggleOpenAccess";
export const TOGGLE_PUBPOLICY = "togglePubpolicy";

export const decrementPage = (): searchAction => ({
    type: DECREMENT_PAGE,
});
export const incrementPage = (): searchAction => ({
    type: INCREMENT_PAGE,
});
export const setPage = (n: number): searchAction => ({
    type: SET_PAGE,
    payload: {
        value: n,
    },
});
export const setPagesize = (n: number): searchAction => ({
    type: SET_PAGESIZE,
    payload: {
        value: n,
    },
});
export const resetPage = (): searchAction => ({
    type: RESET_PAGE
});
export const clear = (): searchAction => ({
    type: CLEAR,
});
export const set_search = (search: string): searchAction => ({
    type: SET_SEARCH,
    payload: {
        value: search,
    },
});
export const set_orderprop = (prop: string): searchAction => ({
    type: SET_ORDER_PROP,
    payload: {
        value: prop,
    },
});
export const set_orderasc = (bool: boolean): searchAction => ({
    type: SET_ORDER_ASC,
    payload: {
        value: bool,
    },
});
export const toggle_orderasc = (): searchAction => ({
    type: TOGGLE_ORDER_ASC,
});
export const toggle_pubpolicy = (): searchAction => ({
    type: TOGGLE_PUBPOLICY,
});
export const toggle_open_access = (): searchAction => ({
    type: TOGGLE_OPEN_ACCESS,
});
export const toggle_embargo = (): searchAction => ({
    type: TOGGLE_EMBARGO,
});
export const set_embargo = (n: number): searchAction => ({
    type: SET_EMBARGO,
    payload: {
        value: n,
    },
});
