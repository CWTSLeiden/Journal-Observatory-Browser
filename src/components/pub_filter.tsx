import React, { useContext } from "react";
import * as searchActions from "../actions/search";
import { DropdownCheckbox, DropdownToggles, CheckboxFilter, SliderFilter } from "./filter";
import { labelize } from "../query/labels";
import { SearchStore, useAppDispatch, useAppSelector } from "../store";
import { LabelContext } from "../context";

export const PubPolicyFilter = () => {
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.pub_policy)
    const dispatch = useAppDispatch()
    return (
        <CheckboxFilter
            state={state}
            action={() => dispatch(searchActions.publication_toggle())}
            label={labelize("ppo:hasPublicationPolicy", labels)}
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
            label={labelize("ppo:isOpenAccess", labels)}
        />
    )
}

export const PubEmbargoFilter = () => {
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.pub_embargo)
    const amount = useAppSelector((store: SearchStore) => store.search.pub_embargoduration)
    const dispatch = useAppDispatch()
    return (
        <DropdownCheckbox
            state={state}
            toggle={() => dispatch(searchActions.publication_embargo_toggle())}
            label={labelize("fabio:hasEmbargoDuration", labels)}
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
    const labels = useContext(LabelContext)
    const state = useAppSelector((store: SearchStore) => store.search.pub_apc)
    const amount = useAppSelector((store: SearchStore) => store.search.pub_apcamount)
    const dispatch = useAppDispatch()
    return (
        <DropdownCheckbox
            state={state}
            toggle={() => dispatch(searchActions.publication_apc_toggle())}
            label={labelize("ppo:hasArticlePublishingCharges", labels)}
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
    const labels = useContext(LabelContext)
    const toggles = useAppSelector((store: SearchStore) => store.search.pub_copyrightowners)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label={labelize("ppo:hasCopyrightOwner", labels)}
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.publication_copyrightowners_toggleone(p))}
            reset_action={() => dispatch(searchActions.publication_copyrightowners_reset())}
        />
    )
}

export const PubLicenseFilter = () => {
    const toggles = useAppSelector((store: SearchStore) => store.search.pub_licenses)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label="License"
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.publication_licenses_toggleone(p))}
            reset_action={() => dispatch(searchActions.publication_licenses_reset())}
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
