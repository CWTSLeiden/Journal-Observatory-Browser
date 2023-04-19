import React, { useContext } from "react";
import * as searchActions from "../store/search";
import { DropdownCheckbox, DropdownToggles, CheckboxFilter, SliderFilter } from "./filter";
import { labelize } from "../query/labels";
import { SearchStore, useAppDispatch, useAppSelector } from "../store";
import { LabelContext } from "../store";

export const ElsewherePolicyFilter = () => {
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.elsewhere_policy)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            label={labelize("ppo:hasPublicationElsewherePolicy", labels)}
            state={state}
            action={() => dispatch(searchActions.elsewhere_toggle())}
        />
    )
}

export const ElsewhereVersionFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.elsewhere_versions)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("ppo:appliesToVersion", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.elsewhere_versions_toggleone(p))}
            reset_action={() => dispatch(searchActions.elsewhere_versions_reset())}
        />
    )
}

export const ElsewhereLocationFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.elsewhere_locations)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("ppo:publicationLocation", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.elsewhere_locations_toggleone(p))}
            reset_action={() => dispatch(searchActions.elsewhere_locations_reset())}
        />
    )
}

export const ElsewhereLicenseFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.elsewhere_licenses)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("dcterms:license", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.elsewhere_licenses_toggleone(p))}
            reset_action={() => dispatch(searchActions.elsewhere_licenses_reset())}
        />
    )
}

export const ElsewhereCopyrightownerFilter = () => {
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.elsewhere_copyrightowners)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("ppo:hasCopyrightOwner", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.elsewhere_copyrightowners_toggleone(p))}
            reset_action={() => dispatch(searchActions.elsewhere_copyrightowners_reset())}
        />
    )
}

export const ElsewhereEmbargoFilter = () => {
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.elsewhere_embargo)
    const amount = useAppSelector((store: SearchStore) => store.search.elsewhere_embargoduration)
    const dispatch = useAppDispatch()
    return (
        <DropdownCheckbox
            state={state}
            toggle={() => dispatch(searchActions.elsewhere_embargo_toggle())}
            label={labelize("fabio:hasEmbargoDuration", labels)}
        >
            <SliderFilter
                state={state}
                value={amount}
                setvalue={(n) => dispatch(searchActions.elsewhere_embargo_set(n))}
                range={[0, 6, 12, 18, 24]}
                unit="Months"
            />
        </DropdownCheckbox>
    )
};
