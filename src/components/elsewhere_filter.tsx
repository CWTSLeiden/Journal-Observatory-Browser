import React from "react";
import * as searchActions from "../actions/search";
import { DropdownCheckbox, DropdownToggles, CheckboxFilter, SliderFilter } from "./filter";
import { labelize } from "../query/labels";
import { SearchStore, useAppDispatch, useAppSelector } from "../store";

export const ElsewhereLicenseFilter = () => {
    const toggles = useAppSelector((store: SearchStore) => store.search.elsewhere_licenses)
    const dispatch = useAppDispatch()
    return (
        <DropdownToggles
            label="License"
            toggles={toggles}
            toggle_action={(p: string) => dispatch(searchActions.toggle_elsewhere_license(p))}
        />
    )
}
