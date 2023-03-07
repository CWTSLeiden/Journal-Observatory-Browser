import React, { ReactElement } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, List, Stack, Typography } from "@mui/material";
import { OpenAccessFilter, PubApcFilter, PubCopyrightOwnersFilter, PubEmbargoFilter, PubLicenseFilter, PubPolicyFilter } from "./pub_filter";
import { CreatorSelect } from "./creator_filter";
import { ExpandMore } from "@mui/icons-material";


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
            </FilterBarSection>

            <Button variant="outlined" onClick={handleSubmit}>
                Filter
            </Button>
        </Stack>
    );
};

export { FilterBar };
