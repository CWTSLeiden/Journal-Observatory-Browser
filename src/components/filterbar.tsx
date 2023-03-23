import React, { ReactElement } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, List, Stack, Typography } from "@mui/material";
import { OpenAccessFilter, PubApcFilter, PubCopyrightOwnersFilter, PubEmbargoFilter, PubLicenseFilter, PubPolicyFilter } from "./filter_publication";
import { ElsewhereCopyrightownerFilter, ElsewhereEmbargoFilter, ElsewhereLicenseFilter, ElsewhereLocationFilter, ElsewherePolicyFilter, ElsewhereVersionFilter } from "./filter_elsewhere";
import { CreatorSelect } from "./filter_creator";
import { ExpandMore } from "@mui/icons-material";
import { EvaluationAnonymizedFilter, EvaluationCommentsFilter, EvaluationInformationFilter, EvaluationInteractionsFilter, EvaluationPolicyFilter } from "./filter_evaluation";
import { useAppDispatch } from "../store";
import * as searchActions from "../store/search";


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
            <List>
                {children}
            </List>
        </AccordionDetails>
    </Accordion>
)

type FilterBarProps = {
    handleSubmit: React.UIEventHandler;
};
const FilterBar = ({ handleSubmit }: FilterBarProps) => {
    const dispatch = useAppDispatch();
    return (
        <Stack id="filter-bar" spacing={2}>
            <CreatorSelect />
            
            <FilterBarSection
                id="filter-panel-publication-policy"
                title="Publication Policy"
            >
                <PubPolicyFilter />
                <OpenAccessFilter />
                <PubApcFilter />
                <PubLicenseFilter />
                <PubCopyrightOwnersFilter />
                <PubEmbargoFilter />
            </FilterBarSection>

            <FilterBarSection
                id="filter-panel-publication-elsewhere-policy"
                title="Publication Elsewhere Policy"
            >
                <ElsewherePolicyFilter />
                <ElsewhereVersionFilter />
                <ElsewhereLocationFilter />
                <ElsewhereLicenseFilter />
                <ElsewhereCopyrightownerFilter />
                <ElsewhereEmbargoFilter />
            </FilterBarSection>

            <FilterBarSection
                id="filter-panel-evaluation-policy"
                title="Evaluation Policy"
            >
                <EvaluationPolicyFilter />
                <EvaluationAnonymizedFilter />
                <EvaluationInteractionsFilter />
                <EvaluationInformationFilter />
                <EvaluationCommentsFilter />
            </FilterBarSection>

            <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleSubmit} sx={{width: "100%"}}>
                Filter
            </Button>
            <Button sx={{width: "100%"}}
                variant="outlined"
                onMouseDown={() => dispatch(searchActions.filter_clear())}
                onMouseUp={handleSubmit}
            >
                Clear
            </Button>
            </Stack>
        </Stack>
    );
};

export { FilterBar };
