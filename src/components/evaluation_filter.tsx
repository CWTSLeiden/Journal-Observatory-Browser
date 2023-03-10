import React from "react";
import * as searchActions from "../actions/search";
import { DropdownToggles, CheckboxFilter, DropdownCheckbox, RadioFilter } from "./filter";
import { labelize } from "../query/labels";
import { SearchStore, useAppDispatch, useAppSelector } from "../store";

export const EvaluationPolicyFilter = () => {
    const state = useAppSelector((store: SearchStore) => store.search.evaluation_policy)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            state={state}
            action={() => dispatch(searchActions.evaluation_toggle())}
            label={labelize("ppo:hasEvaluationPolicy", "has Evaluation Policy")}
        />
    )
}

export const EvaluationAnonymizedFilter = () => {
    const state = useAppSelector((store: SearchStore) => store.search.evaluation_anonymized)
    const value = useAppSelector((store: SearchStore) => store.search.evaluation_anonymizedtype)
    const dispatch = useAppDispatch()
    return (
        <DropdownCheckbox
            state={state}
            toggle={() => dispatch(searchActions.evaluation_anonymized_toggle())}
            label="Anonymized"
        >
            <RadioFilter
                option={value}
                options={["all", "single", "double", "triple"]}
                setoption={(s: string) => dispatch(searchActions.evaluation_anonymized_set(s))}
                labels={{
                    "all": "All Identities Visible",
                    "single": "Single Anonymized",
                    "double": "Double Anonymized",
                    "triple": "Triple Anonymized"
                }}
            />
        </DropdownCheckbox>
    )
};

export const EvaluationInteractionsFilter = () => {
    const toggles = useAppSelector((store: SearchStore) => store.search.evaluation_interactions)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label="Reviewer Interacts With"
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.evaluation_interactions_toggleone(p))}
            reset_action={() => dispatch(searchActions.evaluation_interactions_reset())}
        />
    )
}

export const EvaluationInformationFilter = () => {
    const toggles = useAppSelector((store: SearchStore) => store.search.evaluation_information)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label="Review Information Published"
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.evaluation_information_toggleone(p))}
            reset_action={() => dispatch(searchActions.evaluation_information_reset())}
        />
    )
}

export const EvaluationCommentsFilter = () => {
    const toggles = useAppSelector((store: SearchStore) => store.search.evaluation_comments)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label="Post-Publication Commenting"
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.evaluation_comments_toggleone(p))}
            reset_action={() => dispatch(searchActions.evaluation_comments_reset())}
            labels={{
                "ppo:postPublicationCommentingOpen": "Open",
                "ppo:postPublicationCommentingOnInvitation": "On Invitation",
                "ppo:postPublicationCommentingClosed": "Closed"
            }}
        />
    )
}
