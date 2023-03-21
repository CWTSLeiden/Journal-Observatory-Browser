import React, { useContext, useState } from "react";
import { Box, Card, CardActions, Chip, Divider, Grid, IconButton, ListItem, Skeleton, Typography, useTheme } from "@mui/material";
import { zip_ordering } from "../query/ld";
import { ExpandLess, ExpandMore, Link } from "@mui/icons-material";
import { LabelContext } from "../context";
import { labelize } from "../query/labels";


type PolicyDetailsItemProps = {
    id: string;
    items: Array<[string, string, string | string[]]>;
    summary?: Array<[string, string]>;
    disabled?: boolean;
}
export const PolicyDetailsItem = ({id, items, summary, disabled}: PolicyDetailsItemProps) => {
    const labels = useContext(LabelContext)
    const [state, setState] = useState(false)
    const theme = useTheme()
    const color_text = disabled ? theme.palette.grey[400] : theme.palette.text.primary
    const color_text_sec = disabled ? theme.palette.grey[400] : theme.palette.text.secondary
    const color_card = disabled ? theme.palette.grey[100] : null

    const href = (link: string | string[]) => {
        const ref = Array.isArray(link) ? link.find(Boolean) : link
        const isref = typeof(ref) === "string" ? ref.match(/^(https|http|www):/) : null
        return isref ? ref : null
    }
    const MaybeLink = ({link}: {link: string | string[]}) => {
        const ref = href(link)
        if (ref) {
            return (
                <IconButton edge="end" href={ref} target="_blank">
                    <Link />
                </IconButton>
            )
        }
    }
    const details = (
        <>
            <Box sx={{ml: 1, mr: 1, overflow: 'hidden'}}>
                <Typography
                    noWrap
                    color={color_text_sec}
                    variant="caption"
                >
                    {id}
                </Typography>
            </Box>
            <Divider sx={{mb: 1}} />
            {items.sort(zip_ordering).map(([prop, val, link]) => {
                return (
                    <ListItem component="dl" key={prop + val}
                        secondaryAction={<MaybeLink link={link} />}
                        sx={{m: 0}}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={6}>
                                <Typography
                                    color={color_text_sec}
                                    align="right"
                                    sx={{overflowWrap: 'break-word'}}
                                >
                                    {labelize(prop, labels)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography component="dd"
                                    color={color_text}
                                    sx={{overflowWrap: 'break-word'}}
                                >
                                    {labelize(val, labels)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                )
            })}
        </>
    )
    const summary_component = (
        <PolicyDetailsSummaryItem
            items={summary}
            disabled={disabled}
        />
)
    return (
        <Card variant="outlined" sx={{width: '100%', bgcolor: color_card, p: 1}}>
            {!state && summary && summary.length > 0 ? summary_component : details}
            {summary && summary.length > 0 ? (
                <CardActions
                    onClick={() => setState(!state)}
                    disableSpacing
                    sx={{p: 0, cursor: 'pointer'}}>
                    <IconButton
                        sx={{p: 0, ml: 'auto'}}
                    >
                        { state ? <ExpandLess /> : <ExpandMore /> }
                    </IconButton>
                </CardActions>
            ) : null}
        </Card>
    )
}

type PolicyDetailsItemSummaryProps = {
    items: Array<[string, string]>;
    disabled: boolean
}
export const PolicyDetailsSummaryItem = ({items, disabled}: PolicyDetailsItemSummaryProps) => {
    const labels = useContext(LabelContext)
    const colors = {
        "warning" :"warning",
        "default" :"default",
        "success" :"success",
        "error": "error"
    }
    const theme = useTheme()
    const color_chip = (color: string) => disabled ? theme.palette.grey[100] : colors[color]
    return (
        <Grid container spacing={1}>
            {items.map(([text, color]) => (
                <Grid item key={text}>
                    <Chip
                        label={labelize(text, labels)}
                        color={color_chip(color)}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export const PolicyDetailsItemSkeleton = () => (
    <Skeleton variant="rounded" height={60} />
)
