import React, { ReactElement } from "react";
import { useAppSelector, useAppDispatch, SearchStore } from "../store";
import * as searchActions from "../actions/search";
import { Checkbox, FormControlLabel, FormGroup, Slider } from "@mui/material";
import { Box } from "@mui/system";

type CheckBoxFilterParams = {
    state: (s: SearchStore) => boolean;
    action: () => searchActions.searchAction;
    label: string;
    children?: Array<ReactElement> | ReactElement;
};
const CheckBoxFilter = ({
    state,
    action,
    label,
    children,
}: CheckBoxFilterParams) => {
    const checked = useAppSelector(state);
    const dispatch = useAppDispatch();
    const checkbox = (
        <Checkbox
            checked={Boolean(checked)}
            onChange={() => dispatch(action())}
        />
    );
    return (
        <div className="filter">
            <FormControlLabel control={checkbox} label={label} />
            {children ? <Box sx={{ ml: 4, mr: 4 }}>{children}</Box> : ""}
        </div>
    );
};

const PubPolicyFilter = () => (
    <CheckBoxFilter
        state={(store) => store.search.pubpolicy}
        action={searchActions.toggle_pubpolicy}
        label="hasPubPolicy"
    />
);

const PaywallFilter = () => (
    <CheckBoxFilter
        state={(store) => store.search.paywall}
        action={searchActions.toggle_paywall}
        label="hasPaywall"
    />
);

const EmbargoFilter = () => {
    const state = useAppSelector((s) => s.search.embargo);
    const value = useAppSelector((s) => s.search.embargoduration);
    const dispatch = useAppDispatch();
    return (
        <CheckBoxFilter
            state={(store) => store.search.embargo}
            action={searchActions.toggle_embargo}
            label="hasEmbargo"
        >
            <Slider
                disabled={!state}
                value={Number(value)}
                onChange={(_, n: number) =>
                    dispatch(searchActions.set_embargo(n))
                }
                max={24}
                valueLabelDisplay="auto"
                marks={[0, 6, 12, 18, 24].map((n) => ({
                    value: n,
                    label: `${n}M`,
                }))}
            />
        </CheckBoxFilter>
    );
};

type FilterBarProps = {
    handleSubmit: React.UIEventHandler
};
const FilterBar = ({ handleSubmit }: FilterBarProps) => {
    return (
        <div id="filterbar">
            <h2>Publication Policy</h2>
            <FormGroup>
                <PubPolicyFilter />
                <PaywallFilter />
                <EmbargoFilter />
            </FormGroup>
            <button onClick={handleSubmit}>Filter</button>
        </div>
    );
};

export { FilterBar };
