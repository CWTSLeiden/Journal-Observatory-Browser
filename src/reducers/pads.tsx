import * as actions from "../actions/pads";

export type PadsState = {
    pads: Array<object>;
    total: number;
};

const initPads: PadsState = {
    pads: [],
    total: 0,
};

const sort_pads = (pads: Array<object>, direction: number) => {
    const sort = (a, b) =>
        (a["ppo:_ord"] > b["ppo:_ord"] ? 1 : -1) * direction
    pads.sort(sort)
    return pads
}

const PadsReducer = (state = initPads, action: actions.padsAction) => {
    switch (action.type) {
        case actions.CLEAR:
            return initPads;
        case actions.ADD_PADS:
            return {...state, pads: [...state.pads, ...action.payload.pads]}
        case actions.SET_PADS:
            return {...state, pads: sort_pads(action.payload.pads, action.payload.value)}
        case actions.SET_TOTAL:
            return {...state, total: action.payload.value }
        default:
            return state;
    }
};

export default PadsReducer
