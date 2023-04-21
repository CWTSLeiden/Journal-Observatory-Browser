import React, { useContext } from "react";
import * as searchActions from "../store/search";
import { DropdownToggles, CheckboxFilter } from "./filter";
import { labelize } from "../query/labels";
import { SearchStore, useAppDispatch, useAppSelector } from "../store";
import { LabelContext } from "../store";

export const EvaluationPolicyFilter = () => {
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.evaluation_policy)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            state={state}
            action={() => dispatch(searchActions.evaluation_toggle())}
            label={labelize("scpo:hasEvaluationPolicy", labels)}
        />
    )
}

export const EvaluationAnonymizedFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.evaluation_anonymized)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("anonymized", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.evaluation_anonymized_toggleone(p))}
            reset_action={() => dispatch(searchActions.evaluation_anonymized_reset())}
            labels={{
                "all": "All identities visible",
                "single": "Single anonymized",
                "double": "Double anonymized",
                "triple": "Triple anonymized"
            }}
        />
    )
}

export const EvaluationInteractionsFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.evaluation_interactions)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("reviewer-interacts-with", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.evaluation_interactions_toggleone(p))}
            reset_action={() => dispatch(searchActions.evaluation_interactions_reset())}
        />
    )
}

export const EvaluationInformationFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.evaluation_information)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("review-information-published", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.evaluation_information_toggleone(p))}
            reset_action={() => dispatch(searchActions.evaluation_information_reset())}
        />
    )
}

export const EvaluationCommentsFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.evaluation_comments)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("scpo:hasPostPublicationCommenting", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.evaluation_comments_toggleone(p))}
            reset_action={() => dispatch(searchActions.evaluation_comments_reset())}
        />
    )
}
