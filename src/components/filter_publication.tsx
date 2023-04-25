import React, { useContext } from "react";
import * as searchActions from "../store/search";
import { DropdownCheckbox, DropdownToggles, CheckboxFilter, SliderFilter } from "./filter";
import { labelize } from "../query/labels";
import { SearchStore, useAppDispatch, useAppSelector } from "../store";
import { LabelContext } from "../store";

export const PubPolicyFilter = () => {
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.pub_policy)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            state={state}
            action={() => dispatch(searchActions.publication_toggle())}
            label={labelize("scpo:hasPublicationPolicy", labels)}
        />
    )
}

export const OpenAccessFilter = () => {
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.open_access)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            state={state}
            action={() => dispatch(searchActions.publication_openaccess_toggle())}
            label={labelize("scpo:isOpenAccess", labels)}
        />
    )
}

export const PubEmbargoFilter = () => {
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.pub_embargo)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            state={state}
            action={() => dispatch(searchActions.publication_embargo_toggle())}
            label={labelize("has-no-embargo-duration", labels)}
        />
    )
};

export const PubApcFilter = () => {
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.pub_apc)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            state={state}
            action={() => dispatch(searchActions.publication_apc_toggle())}
            label={labelize("has-no-article-processing-charge", labels)}
        />
    )
};

export const PubCopyrightOwnersFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.pub_copyrightowners)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("scpo:hasCopyrightOwner", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.publication_copyrightowners_toggleone(p))}
            reset_action={() => dispatch(searchActions.publication_copyrightowners_reset())}
        />
    )
}

export const PubLicenseFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.pub_licenses)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("dcterms:license", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.publication_licenses_toggleone(p))}
            reset_action={() => dispatch(searchActions.publication_licenses_reset())}
        />
    )
}
