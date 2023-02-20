export type detailsAction = {
    type: string;
    payload?: {
        value?: string | number | object ;
        list?: Array<object>;
    }
}

export const SET_SOURCES = "setSources"
export const SET_LABELS = "setLabels"

export const set_sources = (sources: Array<object>): detailsAction => ({
    type: SET_SOURCES,
    payload: {
        list: sources
    }
})

export const set_labels = (labels: object): detailsAction => ({
    type: SET_LABELS,
    payload: {
        value: labels
    }
})

