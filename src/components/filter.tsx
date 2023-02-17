import React, { ReactElement, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch, SearchStore } from "../store";
import * as searchActions from "../actions/search";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Slider,
    Stack,
    Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

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
    const [number, setNumber] = useState(value);
    useEffect(() => setNumber(value), [value]);
    const dispatch = useAppDispatch();
    return (
        <CheckBoxFilter
            state={(store) => store.search.embargo}
            action={searchActions.toggle_embargo}
            label="hasEmbargo"
        >
            <Slider
                disabled={!state}
                value={number}
                onChange={(_, n: number) => setNumber(n)}
                onChangeCommitted={(_, n: number) =>
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
    handleSubmit: React.UIEventHandler;
};
const FilterBar = ({ handleSubmit }: FilterBarProps) => {
    return (
        <Stack id="filter-bar" spacing={2}>
            <Accordion defaultExpanded={true}>
                <AccordionSummary
                    id="filter-panel-publication-policy"
                    expandIcon={<ExpandMore />}
                >
                    <Typography sx={{ fontWeight: 600 }}>
                        Publication Policy
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <PubPolicyFilter />
                        <PaywallFilter />
                        <EmbargoFilter />
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
            <Button variant="outlined" onClick={handleSubmit}>
                Filter
            </Button>
        </Stack>
    );
};

export { FilterBar };
