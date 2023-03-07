import { Toggles } from "../reducers/search";

export type searchAction = {
    type: string;
    payload?: searchActionPayload;
};
type searchActionPayload = {
    value?: string | boolean | number;
    toggles?: Toggles
};


export const CLEAR = "clear";
export const clear = (): searchAction => ({
    type: CLEAR,
});

export const DECREMENT_PAGE = "decrementPage";
export const decrement_page = (): searchAction => ({
    type: DECREMENT_PAGE,
});

export const INCREMENT_PAGE = "incrementPage";
export const increment_page = (): searchAction => ({
    type: INCREMENT_PAGE,
});

export const RESET_PAGE = "resetPage";
export const reset_page = (): searchAction => ({
    type: RESET_PAGE
});

export const RESET_CREATORS = "resetCreators"
export const reset_creators = (): searchAction => ({
    type: RESET_CREATORS
});
export const RESET_PUB_LICENSES = "resetPubLicenses"
export const reset_pub_licenses = (): searchAction => ({
    type: RESET_PUB_LICENSES
});

export const SET_CREATORS = "setCreators"
export const set_creators = (creators: Toggles): searchAction => ({
    type: SET_CREATORS,
    payload: {
        toggles: creators
    }
});
export const SET_PUB_LICENSES = "setPubLicenses"
export const set_pub_licenses = (pub_licenses: Toggles): searchAction => ({
    type: SET_PUB_LICENSES,
    payload: {
        toggles: pub_licenses
    }
});

export const SET_ORDER_ASC = "setOrderAsc";
export const set_orderasc = (bool: boolean): searchAction => ({
    type: SET_ORDER_ASC,
    payload: {
        value: bool,
    },
});

export const SET_ORDER_PROP = "setOrderProp";
export const set_orderprop = (prop: string): searchAction => ({
    type: SET_ORDER_PROP,
    payload: {
        value: prop,
    },
});

export const SET_PAGE = "setPage";
export const set_page = (n: number): searchAction => ({
    type: SET_PAGE,
    payload: {
        value: n,
    },
});

export const SET_PAGESIZE = "setPagesize";
export const set_page_size = (n: number): searchAction => ({
    type: SET_PAGESIZE,
    payload: {
        value: n,
    },
});

export const SET_PUB_APC = "setPubApc";
export const set_pub_apc = (n: number): searchAction => ({
    type: SET_PUB_APC,
    payload: {
        value: n,
    },
});

export const SET_PUB_EMBARGO = "setPubEmbargo";
export const set_pub_embargo = (n: number): searchAction => ({
    type: SET_PUB_EMBARGO,
    payload: {
        value: n,
    },
});

export const SET_SEARCH = "setSearch";
export const set_search = (search: string): searchAction => ({
    type: SET_SEARCH,
    payload: {
        value: search,
    },
});

export const TOGGLE_CREATOR = "toggleCreator";
export const toggle_creator = (creator: string): searchAction => ({
    type: TOGGLE_CREATOR,
    payload: {
        value: creator,
    },
});

export const TOGGLE_PUB_LICENSE = "togglePubLicense";
export const toggle_pub_license = (pub_license: string): searchAction => ({
    type: TOGGLE_PUB_LICENSE,
    payload: {
        value: pub_license,
    },
});

export const TOGGLE_OPEN_ACCESS = "toggleOpenAccess";
export const toggle_open_access = (): searchAction => ({
    type: TOGGLE_OPEN_ACCESS,
});

export const TOGGLE_ORDER_ASC = "toggleOrderAsc";
export const toggle_orderasc = (): searchAction => ({
    type: TOGGLE_ORDER_ASC,
});

export const TOGGLE_PUB_APC = "togglePubApc";
export const toggle_pub_apc = (): searchAction => ({
    type: TOGGLE_PUB_APC,
});

export const TOGGLE_PUB_EMBARGO = "togglePubEmbargo";
export const toggle_pub_embargo = (): searchAction => ({
    type: TOGGLE_PUB_EMBARGO,
});

export const TOGGLE_PUB_POLICY = "togglePubPolicy";
export const toggle_pub_policy = (): searchAction => ({
    type: TOGGLE_PUB_POLICY,
});

