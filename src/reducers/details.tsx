import * as actions from "../actions/details";

export type DetailsState = {
    sources: Array<object>
    labels: object
    meta?: object;
    meta_id?: object;
    meta_org?: object;
    publishing_policies?: Array<object>;
}

const initDetails: DetailsState = {
    sources: [],
    labels: {}
}

const DetailsReducer = (state = initDetails, action : actions.detailsAction) => {
    switch (action.type) {
        case actions.SET_SOURCES:
            return {...state, sources: action.payload.list}
        case actions.SET_LABELS:
            return {...state, labels: action.payload.value}
        default:
            return state;
    }
}

export default DetailsReducer
