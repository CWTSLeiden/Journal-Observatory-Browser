import * as actions from "../actions/details";

export type DetailsState = {
    sources: Array<object>
    meta?: object;
    meta_id?: object;
    meta_org?: object;
    publishing_policies?: Array<object>;
}

const initDetails: DetailsState = {
    sources: []
}

const DetailsReducer = (state = initDetails, action : actions.detailsAction) => {
    switch (action.type) {
        case actions.SET_SOURCES:
            return {...state, sources: Array.isArray(action.payload.value) ? action.payload.value : Array(action.payload.value)}
        default:
            return state;
    }
}

export default DetailsReducer
