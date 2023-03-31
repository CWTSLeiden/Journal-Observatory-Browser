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
            state={state}
            action={() => dispatch(searchActions.elsewhere_toggle())}
            label={labelize("ppo:hasPublicationElsewherePolicy", labels)}
        />
    )
}

export const ElsewhereVersionFilter = () => {
    const toggles = useAppSelector((store: SearchStore) => store.search.elsewhere_versions)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label="Applies To Version"
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.elsewhere_versions_toggleone(p))}
            reset_action={() => dispatch(searchActions.elsewhere_versions_reset())}
            labels={{
                "pso:submitted": "Submitted",
                "pso:accepted-for-publication": "Accepted",
                "pso:published": "Published",
            }}
        />
    )
}

export const ElsewhereLocationFilter = () => {
    const toggles = useAppSelector((store: SearchStore) => store.search.elsewhere_locations)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label="Location"
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.elsewhere_locations_toggleone(p))}
            reset_action={() => dispatch(searchActions.elsewhere_locations_reset())}
            labels={{
                "non_commercial_institutional_repository": "Non Commercial Institutional Repository",
                "non_commercial_subject_repository": "Non Commercial Subject Repository",
                "non_commercial_social_network": "Non Commercial Social Network",
                "this_journal": "This Journal",
                "named_repository": "Named Repository",
                "any_website": "Any Website",
                "preprint_repository": "Preprint Repository",
                "institutional_website": "Institutional Website",
                "named_academic_social_network": "Named Academic Social Network",
                "any_repository": "Any Repository",
                "non_commercial_repository": "Non Commercial Repository",
                "non_commercial_website": "Non Commercial Website",
                "institutional_repository": "Institutional Repository",
                "authors_homepage": "Authors Homepage",
                "funder_designated_location": "Funder Designated Location",
                "subject_repository": "Subject Repository",
                "academic_social_network": "Academic Social Network",
            }}
        />
    )
}

export const ElsewhereLicenseFilter = () => {
    const toggles = useAppSelector((store: SearchStore) => store.search.elsewhere_licenses)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label="License"
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.elsewhere_licenses_toggleone(p))}
            reset_action={() => dispatch(searchActions.elsewhere_licenses_reset())}
            labels={{
                "https://creativecommons.org/publicdomain/zero/1.0/": "CC0",
                "https://creativecommons.org/licenses/by/4.0/": "CC BY",
                "https://creativecommons.org/licenses/by-nc/4.0/": "CC BY-NC",
                "https://creativecommons.org/licenses/by-nc-nd/4.0/": "CC BY-NC-ND",
                "https://creativecommons.org/licenses/by-nc-sa/4.0/": "CC BY-NC-SA",
                "https://creativecommons.org/licenses/by-nd/4.0/": "CC BY-ND",
                "https://creativecommons.org/licenses/by-sa/4.0/": "CC BY-SA"
            }}
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
