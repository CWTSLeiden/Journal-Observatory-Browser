import React, { ReactElement, useContext, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Divider, List, Paper, Stack, Typography } from "@mui/material";
import { OpenAccessFilter, PubApcFilter, PubCopyrightOwnersFilter, PubEmbargoFilter, PubLicenseFilter, PubPolicyFilter } from "./filter_publication";
import { ElsewhereCopyrightownerFilter, ElsewhereEmbargoFilter, ElsewhereLicenseFilter, ElsewhereLocationFilter, ElsewherePolicyFilter, ElsewhereVersionFilter } from "./filter_elsewhere";
import { CreatorSelect } from "./filter_creator";
import { ExpandMore } from "@mui/icons-material";
import { EvaluationAnonymizedFilter, EvaluationCommentsFilter, EvaluationInformationFilter, EvaluationInteractionsFilter, EvaluationPolicyFilter } from "./filter_evaluation";
import { LabelContext, useAppDispatch } from "../store";
import * as searchActions from "../store/search";
import { AnnotationDialog } from "./info";
import info from "../strings/info.json";
import { labelize } from "../query/labels";


type FilterBarSectionProps = {
    id: string,
    title: string,
    infodialog?: ReactElement,
    children: ReactElement | ReactElement[]
};
const FilterBarSection = ({ id, title, infodialog, children }: FilterBarSectionProps ) => {
    const [state, setState] = useState(true)
    const toggle = () => setState(!state)
    return (
        <Card variant="outlined">
            <Accordion expanded={state} disableGutters={true}>
                <AccordionSummary id={id} expandIcon={<ExpandMore onClick={toggle} />} sx={{ pt: 0, pb: 0, pl: 2, pr: 1 }}>
                    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                        <Typography onClick={toggle} sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                        {infodialog}
                        <Box sx={{ flex: 1 }} onClick={toggle} >&nbsp;</Box>
                    </Box>
                </AccordionSummary>
                <Divider />
                <AccordionDetails sx={{ pl: 1 }}>
                    <List>
                        {children}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Card>
    )
}

type FilterBarProps = {
    handleSubmit: React.UIEventHandler;
};
const FilterBar = ({ handleSubmit }: FilterBarProps) => {
    const labels = useContext(LabelContext)
    const dispatch = useAppDispatch();
    return (
        <Stack id="filter-bar" spacing={2}>
            <CreatorSelect />
            
            <FilterBarSection
                id="filter-panel-publication-policy"
                title={labelize("scpo:PublicationPolicy", labels)}
                infodialog={<AnnotationDialog property="scpo:PublicationPolicy" text={info["publication-policy-filterbar"]}/>}
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
                title={labelize("scpo:PublicationElsewherePolicy", labels)}
                infodialog={<AnnotationDialog property="scpo:PublicationElsewherePolicy" text={info["elsewhere-policy-filterbar"]}/>}
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
                title={labelize("scpo:EvaluationPolicy", labels)}
                infodialog={<AnnotationDialog property="scpo:EvaluationPolicy" text={info["evaluation-policy-filterbar"]}/>}
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
