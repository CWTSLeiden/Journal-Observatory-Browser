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
    Collapse,
    FormControlLabel,
    FormGroup,
    Slider,
    Stack,
    Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { OpenAccessFilter, PubApcFilter, PubEmbargoFilter, PubPolicyFilter } from "./pub_filter";
import { CreatorSelect } from "./creator_filter";

type CheckBoxFilterParams = {
    state: (s: SearchStore) => boolean;
    action: () => searchActions.searchAction;
    label: string;
    children?: ReactElement[] | ReactElement;
};
export const CheckBoxFilter = ({
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
        <Box>
            <FormControlLabel control={checkbox} label={label} sx={{width: "100%"}} />
            {children ? <Box sx={{ ml: 4, mr: 4 }}>{children}</Box> : ""}
        </Box>
    );
};

type SliderFilterParams = {
    state: (s: SearchStore) => boolean;
    value: (s: SearchStore) => number;
    action: (n: number) => searchActions.searchAction;
    range: number[];
    unit?: string;
};
export const SliderFilter = ({
    state,
    value,
    action,
    range,
    unit,
}: SliderFilterParams) => {
    const checked_state = useAppSelector(state);
    const value_state = useAppSelector(value);
    const dispatch = useAppDispatch();
    const [number, setNumber] = useState(value_state);
    useEffect(() => setNumber(value_state), [value_state]);
    return (
        <Slider
            disabled={!checked_state}
            valueLabelFormat={(n) => <div>{`${n} ${unit ? unit : ""}`}</div>}
            value={number}
            onChange={(_, n: number) => setNumber(n)}
            onChangeCommitted={(_, n: number) => dispatch(action(n))}
            min={Math.min(...range)}
            max={Math.max(...range)}
            valueLabelDisplay="auto"
            marks={range.map((n) => ({
                value: n,
                label: String(n),
            }))}
        />
    );
};

type CheckSliderFilterParams = {
    state: (s: SearchStore) => boolean;
    togglestate: () => searchActions.searchAction;
    value: (s: SearchStore) => number;
    setvalue: (n: number) => searchActions.searchAction;
    label: string;
    range: number[];
    unit?: string;
};
export const CheckSliderFilter = ({
    state,
    togglestate,
    value,
    setvalue,
    label,
    range,
    unit,
}: CheckSliderFilterParams) => (
    <CheckBoxFilter
        state={state}
        action={togglestate}
        label={label}
    >
        <Collapse in={useAppSelector(state)}>
        <SliderFilter
            state={state}
            value={value}
            action={setvalue}
            range={range}
            unit={unit}
        />
        </Collapse>
    </CheckBoxFilter>
)

type FilterBarSectionProps = {
    id: string,
    title: string,
    folded?: boolean
    children: ReactElement | ReactElement[]
};
const FilterBarSection = ({ id, title, folded, children }: FilterBarSectionProps ) => (
    <Accordion defaultExpanded={!folded}>
        <AccordionSummary id={id} expandIcon={<ExpandMore />} >
            <Typography sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <FormGroup>
                {children}
            </FormGroup>
        </AccordionDetails>
    </Accordion>
)

type FilterBarProps = {
    handleSubmit: React.UIEventHandler;
};
const FilterBar = ({ handleSubmit }: FilterBarProps) => {
    return (
        <Stack id="filter-bar" spacing={2}>
            <CreatorSelect />
            
            <FilterBarSection
                id="filter-panel-publication-policy"
                title="Publication Policy"
            >
                <PubPolicyFilter />
                <OpenAccessFilter />
                <PubEmbargoFilter />
                <PubApcFilter />
            </FilterBarSection>

            <Button variant="outlined" onClick={handleSubmit}>
                Filter
            </Button>
        </Stack>
    );
};

export { FilterBar };
