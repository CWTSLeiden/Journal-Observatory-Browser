import React, { useContext, useState } from "react";
import { Avatar, Box, Card, CardActions, Chip, Divider, Grid, IconButton, IconTypeMap, List, ListItem, ListItemButton, Skeleton, Typography, useTheme } from "@mui/material";
import { expand_id, ld_to_str } from "../query/jsonld_helpers";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { LabelContext } from "../store";
import { labelize } from "../query/labels";
import { MaybeLinkIcon } from "./details";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export type PolicyItem = {
    id: string,
    type: string,
    value?: string,
    url?: string,
    summary?: string,
    color?: string,
    Icon?: OverridableComponent<IconTypeMap>
}

export const zip_policy_prop = (policy: object) => (prop: string): PolicyItem[] => {
    const val = Array.isArray(policy[prop]) ? policy[prop] : [policy[prop]]
    return val
        .filter(Boolean)
        .map((v: object) => ({
            id: ld_to_str(policy["@id"]),
            type: prop,
            value: ld_to_str(v),
        } as PolicyItem))
}

export const linkify_policy_item = (item: PolicyItem): PolicyItem => {
    return {...item, url: expand_id(item.value)}
}

export const policy_item_ordering = (a: PolicyItem, b: PolicyItem) => {
    const compare = (a: string, b: string) => {
        return (a == null && b != null) ? true : a.toLowerCase() > b.toLowerCase() ? true : false
    }
    if (compare(a.type, b.type)) { return 1 }
    if (compare(b.type, a.type)) { return -1 }
    if (compare(a.value, b.value)) { return 1 }
    if (compare(b.value, a.value)) { return -1 }
    return 0
}

type PolicyDetailsItemProps = {
    id: string;
    items: PolicyItem[];
    disabled?: boolean;
}
export const PolicyDetailsItem = ({id, items, disabled}: PolicyDetailsItemProps) => {
    const labels = useContext(LabelContext)
    const [state, setState] = useState(false)
    const theme = useTheme()
    const color_text = disabled ? theme.palette.grey[400] : theme.palette.text.primary
    const color_text_sec = disabled ? theme.palette.grey[400] : theme.palette.text.secondary
    const color_card = disabled ? theme.palette.grey[100] : null

    const details_items = items.filter(Boolean).filter(i => i.value)
    const summary_items = items.filter(Boolean).filter(i => i.summary)

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
                {details_items
                    .sort(policy_item_ordering)
                    .map(item => {
                    return (
                        <ListItem
                            key={item.id + item.type + item.value}
                            secondaryAction={<MaybeLinkIcon link={item.url} />}
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
                                        {labelize(item.type, labels)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        variant="body1"
                                        color={color_text}
                                        sx={{overflowWrap: 'break-word'}}
                                    >
                                        {labelize(item.value, labels)}
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
            items={summary_items}
            disabled={disabled}
        />
)
    return (
        <Card variant="outlined" sx={{width: '100%', bgcolor: color_card, p: 1}}>
            {summary_items.length > 0 ? summary_component : null}
            {summary_items.length > 0 && !state ? null : details}
            {summary_items.length > 0 ? (
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

type ChipIconProps = {
    label: string;
    color: string;
    Icon?: OverridableComponent<IconTypeMap>;
    disabled?: boolean;
}
export const ChipIcon = ({label, color, Icon, disabled}: ChipIconProps) => {
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
    const safecolor = disabled ? color_grey : colors[color]
    const icon = Icon ? (
        <Avatar sx={{bgcolor: color_grey}}>
            <Icon fontSize="small" color={safecolor} />
        </Avatar>
    ) : null
    return (
        <Chip
            label={label}
            color={safecolor}
            avatar={icon}
            sx={{
                "& .MuiChip-avatarColorPrimary": {backgroundColor: color_grey},
                "& .MuiChip-avatarColorSecondary": {backgroundColor: color_grey}
            }}
        />
    )
}


type PolicyDetailsItemSummaryProps = {
    items: PolicyItem[];
    disabled: boolean
}
export const PolicyDetailsSummaryItem = ({items, disabled}: PolicyDetailsItemSummaryProps) => {
    const labels = useContext(LabelContext)
    return (
        <Grid container spacing={1}>
            {items.map(item => (
                <Grid item key={item.id + item.type + item.summary}>
                    <ChipIcon
                        label={labelize(item.summary, labels)}
                        color={item.color}
                        Icon={item.Icon}
                        disabled={disabled}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export const PolicyDetailsItemSkeleton = () => (
    <Skeleton variant="rounded" height={60} />
)
