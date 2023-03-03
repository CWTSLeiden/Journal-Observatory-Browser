import React, { ReactElement } from "react";
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
    Stack,
    Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { OpenAccessFilter, PubEmbargoFilter, PubPolicyFilter } from "./pub_filter";
import { CreatorSelect } from "./creator_filter";

type CheckBoxFilterParams = {
    state: (s: SearchStore) => boolean;
    action: () => searchActions.searchAction;
    label: string;
    children?: Array<ReactElement> | ReactElement;
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
            </FilterBarSection>

            <Button variant="outlined" onClick={handleSubmit}>
                Filter
            </Button>
        </Stack>
    );
};

export { FilterBar };
