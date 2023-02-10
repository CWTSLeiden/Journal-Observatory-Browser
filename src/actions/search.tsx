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
export const SET_SEARCH = "setSearch";
export const TOGGLE_EMBARGO = "toggleEmbargo";
export const TOGGLE_PAYWALL = "togglePaywall";
export const TOGGLE_PUBPOLICY = "togglePubpolicy";

export const clear = (): searchAction => ({
    type: CLEAR,
});
export const set_search = (search: string): searchAction => ({
    type: SET_SEARCH,
    payload: {
        value: search,
    },
});
export const toggle_pubpolicy = (): searchAction => ({
    type: TOGGLE_PUBPOLICY,
});
export const toggle_paywall = (): searchAction => ({
    type: TOGGLE_PAYWALL,
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
