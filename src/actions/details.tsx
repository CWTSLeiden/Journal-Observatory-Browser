export type detailsAction = {
    type: string;
    payload?: { value: object | Array<object> }
}

export const SET_SOURCES = "setSources"

export const set_sources = (sources: Array<object>): detailsAction => ({
    type: SET_SOURCES,
    payload: {
        value: sources
    }
})
