import React, { ReactElement, useContext, useEffect, useState } from "react";
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
import { AppContext } from "../context";

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

const PubPolicyFilter = () => {
    const label = useContext(AppContext).labels["ppo:hasPublicationPolicy"] || "has Publication Policy"
    return (
        <CheckBoxFilter
            state={(store) => store.search.pubpolicy}
            action={searchActions.toggle_pubpolicy}
            label={label}
        />
)}

const OpenAccessFilter = () => {
    const label = useContext(AppContext).labels["ppo:isOpenAccess"] || "is Open Access"
    return (
        <CheckBoxFilter
            state={(store) => store.search.open_access}
            action={searchActions.toggle_open_access}
            label={label}
        />
)}

const Pub_EmbargoFilter = () => {
    const state = useAppSelector((s) => s.search.pub_embargo);
    const value = useAppSelector((s) => s.search.pub_embargoduration);
    const label = useContext(AppContext).labels["fabio:hasEmbargoDuration"] || "has Embargo Duration"
    const [number, setNumber] = useState(value);
    useEffect(() => setNumber(value), [value]);
    const dispatch = useAppDispatch();
    return (
        <CheckBoxFilter
            state={(store) => store.search.pub_embargo}
            action={searchActions.toggle_pub_embargo}
            label={label}
        >
            <Slider
                disabled={!state}
                value={number}
                onChange={(_, n: number) => setNumber(n)}
                onChangeCommitted={(_, n: number) =>
                    dispatch(searchActions.set_pub_embargo(n))
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

type FilterBarSectionProps = {
    id: string,
    title: string,
    children: ReactElement[]
};
const FilterBarSection = ({ id, title, children }: FilterBarSectionProps ) => (
    <Accordion defaultExpanded={true}>
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
            <FilterBarSection
                id="filter-panel-publication-policy"
                title="Publication Policy"
            >
                <PubPolicyFilter />
                <OpenAccessFilter />
                <Pub_EmbargoFilter />
            </FilterBarSection>
            <Button variant="outlined" onClick={handleSubmit}>
                Filter
            </Button>
        </Stack>
    );
};

export { FilterBar };
