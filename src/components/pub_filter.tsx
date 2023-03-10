import React from "react";
import * as searchActions from "../actions/search";
import { DropdownCheckbox, DropdownToggles, CheckboxFilter, SliderFilter } from "./filter";
import { labelize } from "../query/labels";
import { SearchStore, useAppDispatch, useAppSelector } from "../store";

export const PubPolicyFilter = () => {
    const state = useAppSelector((store: SearchStore) => store.search.pub_policy)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            state={state}
            action={() => dispatch(searchActions.publication_toggle())}
            label={labelize("ppo:hasPublicationPolicy", "has Publication Policy")}
        />
    )
}

export const OpenAccessFilter = () => {
    const state = useAppSelector((store: SearchStore) => store.search.open_access)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            state={state}
            action={() => dispatch(searchActions.publication_openaccess_toggle())}
            label={labelize("ppo:isOpenAccess", "is Open Access")}
        />
    )
}

export const PubEmbargoFilter = () => {
    const state = useAppSelector((store: SearchStore) => store.search.pub_embargo)
    const amount = useAppSelector((store: SearchStore) => store.search.pub_embargoduration)
    const dispatch = useAppDispatch()
    return (
        <DropdownCheckbox
            state={state}
            toggle={() => dispatch(searchActions.publication_embargo_toggle())}
            label={labelize("ppo:hasEmbargo", "has Embargo")}
        >
            <SliderFilter
                state={state}
                value={amount}
                setvalue={(n) => dispatch(searchActions.publication_embargo_set(n))}
                range={[0, 6, 12, 18, 24]}
                unit="Months"
            />
        </DropdownCheckbox>
    )
};

export const PubApcFilter = () => {
    const state = useAppSelector((store: SearchStore) => store.search.pub_apc)
    const amount = useAppSelector((store: SearchStore) => store.search.pub_apcamount)
    const dispatch = useAppDispatch()
    return (
        <DropdownCheckbox
            state={state}
            toggle={() => dispatch(searchActions.publication_apc_toggle())}
            label={labelize("ppo:hasArticlePublishingCharges", "has APC")}
        >
            <SliderFilter
                state={state}
                value={amount}
                setvalue={(n) => dispatch(searchActions.publication_apc_set(n))}
                range={[0, 100, 200, 300, 400]}
                unit="USD"
            />
        </DropdownCheckbox>
    )
};

export const PubCopyrightOwnersFilter = () => {
    const toggles = useAppSelector((store: SearchStore) => store.search.pub_copyrightowners)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("ppo:hasCopyrightOwner", "has Copyright Owners")}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.publication_copyrightowners_toggleone(p))}
            reset_action={() => dispatch(searchActions.publication_copyrightowners_reset())}
        />
    )
}
