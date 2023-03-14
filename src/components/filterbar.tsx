import React, { ReactElement } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, List, Stack, Typography } from "@mui/material";
import { OpenAccessFilter, PubApcFilter, PubCopyrightOwnersFilter, PubEmbargoFilter, PubLicenseFilter, PubPolicyFilter } from "./pub_filter";
import { ElsewhereCopyrightownerFilter, ElsewhereEmbargoFilter, ElsewhereLicenseFilter, ElsewhereLocationFilter, ElsewherePolicyFilter, ElsewhereVersionFilter } from "./elsewhere_filter";
import { CreatorSelect } from "./creator_filter";
import { ExpandMore } from "@mui/icons-material";
import { EvaluationAnonymizedFilter, EvaluationCommentsFilter, EvaluationInformationFilter, EvaluationInteractionsFilter, EvaluationPolicyFilter } from "./evaluation_filter";


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
                <PubCopyrightOwnersFilter />
                <PubLicenseFilter />
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

            <Button variant="outlined" onClick={handleSubmit}>
                Filter
            </Button>
        </Stack>
    );
};

export { FilterBar };
