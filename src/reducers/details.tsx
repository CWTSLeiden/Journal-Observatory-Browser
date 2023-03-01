import * as actions from "../actions/details";

export type DetailsState = {
    sources: Array<object>;
}

const initDetails: DetailsState = {
    sources: []
}

const DetailsReducer = (state = initDetails, action : actions.detailsAction) => {
    switch (action.type) {
        case actions.SET_SOURCES:
            return {...state, sources: action.payload.list}
        default:
            return state;
    }
}

export default DetailsReducer
