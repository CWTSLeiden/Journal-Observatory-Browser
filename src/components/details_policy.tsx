import React, { useContext, useState } from "react";
import { Avatar, Box, Card, CardActions, Chip, Divider, Grid, IconButton, List, ListItem, ListItemButton, Skeleton, Typography, useTheme } from "@mui/material";
import { zip_ordering } from "../query/ld";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { LabelContext } from "../store";
import { labelize } from "../query/labels";
import { Summary } from "./details_policy_summary";
import { MaybeLink, MaybeLinkIcon } from "./details";

export type Item = [string, string, string?]

type PolicyDetailsItemProps = {
    id: string;
    items: Array<Item>;
    summary?: Array<Summary>;
    disabled?: boolean;
}
export const PolicyDetailsItem = ({id, items, summary, disabled}: PolicyDetailsItemProps) => {
    const labels = useContext(LabelContext)
    const [state, setState] = useState(false)
    const theme = useTheme()
    const color_text = disabled ? theme.palette.grey[400] : theme.palette.text.primary
    const color_text_sec = disabled ? theme.palette.grey[400] : theme.palette.text.secondary
    const color_card = disabled ? theme.palette.grey[100] : null

    const details = (
        <Box sx={{mt: 2}}>
            <Box sx={{m: 1, overflow: 'hidden'}}>
                <Typography
                    noWrap
                    color={color_text_sec}
                    variant="caption"
                >
                    {id}
                </Typography>
            </Box>
            <Divider sx={{mb: 1}} />
            <List dense>
                {items
                    .filter(Boolean)
                    .sort(zip_ordering)
                    .map(([prop, val, link]) => {
                    return (
                        <ListItem
                            key={prop + val}
                            secondaryAction={<MaybeLinkIcon link={link} />}
                        >
                            <ListItemButton sx={{minHeight: 32, cursor: 'default'}}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={6}>
                                    <Typography
                                        variant="body2"
                                        color={color_text_sec}
                                        align="right"
                                        sx={{overflowWrap: 'break-word'}}
                                    >
                                        {labelize(prop, labels)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        variant="body1"
                                        color={color_text}
                                        sx={{overflowWrap: 'break-word'}}
                                    >
                                        {labelize(val, labels)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
    const summary_component = (
        <PolicyDetailsSummaryItem
            items={summary}
            disabled={disabled}
        />
)
    return (
        <Card variant="outlined" sx={{width: '100%', bgcolor: color_card, p: 1}}>
            {summary && summary.length > 0 ? summary_component : null}
            {summary && summary.length > 0 && !state ? null : details}
            {summary && summary.length > 0 ? (
                <CardActions
                    onClick={() => setState(!state)}
                    disableSpacing
                    sx={{p: 0, cursor: 'pointer'}}>
                    <IconButton sx={{p: 0, ml: 'auto'}} >
                        { state ? <ExpandLess /> : <ExpandMore /> }
                    </IconButton>
                </CardActions>
            ) : null}
        </Card>
    )
}

type PolicyDetailsItemSummaryProps = {
    items: Summary[];
    disabled: boolean
}
export const PolicyDetailsSummaryItem = ({items, disabled}: PolicyDetailsItemSummaryProps) => {
    const labels = useContext(LabelContext)
    const colors = {
        "primary" :"primary",
        "secondary" :"secondary",
        "warning" :"warning",
        "default" :"default",
        "success" :"success",
        "error": "error"
    }
    const theme = useTheme()
    const color_grey = theme.palette.grey[100]
    return (
        <Grid container spacing={1}>
            {items.filter(Boolean).map(([text, color, Icon]) => {
                const safecolor = disabled ? color_grey : colors[color]
                const icon = Icon ? (
                    <Avatar sx={{bgcolor: color_grey}}>
                        <Icon fontSize="small" color={safecolor} />
                    </Avatar>
                ) : null
                return (
                    <Grid item key={text}>
                        <Chip
                            label={labelize(text, labels)}
                            color={safecolor}
                            avatar={icon}
                            sx={{
                                "& .MuiChip-avatarColorPrimary": {backgroundColor: color_grey},
                                "& .MuiChip-avatarColorSecondary": {backgroundColor: color_grey}
                            }}
                        />
                    </Grid>
            )})}
        </Grid>
    )
}

export const PolicyDetailsItemSkeleton = () => (
    <Skeleton variant="rounded" height={60} />
)
