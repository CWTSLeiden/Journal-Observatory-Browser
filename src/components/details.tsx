import React, { ReactElement } from "react";
import { Avatar, Badge, Card, CardContent, CardHeader, Chip, Divider, Grid, IconButton, ListItem, ListItemAvatar, ListItemText, Skeleton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { ld_to_str } from "../query/ld";
import { labelize } from "../query/labels";
import { colorize } from "./theme";
import { Link } from "@mui/icons-material";
import { useAppSelector } from "../store";

export const SourceWrapper = ({src, children}: {src: string[], children?: ReactElement}) => {
    const sources_store = useAppSelector(s => s.details.sources)
    const sources_disabled = useAppSelector(s => s.details.sources_disabled)
    const sources_enabled = src.filter(s => !(sources_disabled.includes(s)))
    const sources = sources_enabled.map(s => sources_store[s]).filter(Boolean)
    const creators = sources.map(s => ld_to_str(s ? s["dcterms:creator"] : "?"))
    const creators_chips = creators.map(c => (
        <Grid item key={c}>
            <Chip size="small" color={colorize(c)} label={labelize(c)} />
        </Grid>
    ))
    return (
        <Tooltip
            placement="top-end"
            title={<Grid container spacing={1}>{creators_chips}</Grid>}
        >
            <Badge
                badgeContent={sources.length}
                color={sources.length == 1 ? colorize(creators.find(Boolean)) : "custom0" }
                variant={sources.length > 1 ? "standard" : "dot"}
                invisible={sources.length < 1}
            >
                {children}
            </Badge>
        </Tooltip>
    )
}

const filter_children_src = (disabled: Array<string>) => (child: React.ReactNode) => {
    if (React.isValidElement(child)) {
        const src = child.props["src"]
        if (Array.isArray(src) && src.length > 0) {
            return Boolean(src.find(s => !disabled.includes(s)))
        }
    }
    return true
}

type DetailsSwitchProps = {
    items?: React.ReactElement | React.ReactElement[]
    filter?: (r: React.ReactElement) => boolean
    loading?: boolean
    loading_component?: React.ReactElement | React.ReactElement[]
    hidden_component?: React.ReactElement | React.ReactElement[]
    missing_component?: React.ReactElement | React.ReactElement[]
}
export const DetailsSwitch = ({items, filter, loading, loading_component, hidden_component, missing_component}: DetailsSwitchProps) => {
    const items_list = Array.isArray(items) ? items : [items]
    const filtered_list = items_list.filter(filter)
    if (filtered_list.length > 0) { return <>{filtered_list}</> }
    if (items_list.length > 0) { return <>{hidden_component}</> }
    if (loading) { return <>{loading_component}</> }
    return <>{missing_component}</>
}

type DetailsCardProps = {
    title: string;
    children?: React.ReactElement | React.ReactElement[];
    loading?: boolean
}
export const DetailsCard = ({title, children, loading}: DetailsCardProps) => {
    const sources_disabled = useAppSelector(s => s.details.sources_disabled)
    const loading_component = [<DetailsListItemSkeleton key="0" />]
    const hidden_component = [<DetailsListItem key="0" primary="Hidden" secondary="Expand source filter" disabled />]
    const missing_component = [<DetailsListItem key="0" primary="No data" disabled />]
    return (
        <Card>
            <CardHeader title={title} />
            <Divider />
            <CardContent>
                <Stack direction="column" spacing={1}>
                    <DetailsSwitch
                        items={children}
                        filter={filter_children_src(sources_disabled)}
                        loading={loading}
                        loading_component={loading_component}
                        missing_component={missing_component}
                        hidden_component={hidden_component}
                    />
                </Stack>
            </CardContent>
        </Card>
)}

type DetailsListItemProps = {
    primary: string;
    secondary?: string;
    avatar?: ReactElement;
    link?: string | string[];
    disabled?: boolean;
}
export const DetailsListItem = ({primary, secondary, avatar, link, disabled}: DetailsListItemProps) => {
    const theme = useTheme()
    const color_text = disabled ? theme.palette.grey[400] : theme.palette.text.primary
    const color_text_sec = disabled ? theme.palette.grey[400] : theme.palette.text.secondary
    const color_card = disabled ? theme.palette.grey[100] : null

    const avatar_component = (
        <ListItemAvatar>
            <Avatar>
                {avatar}
            </Avatar>
        </ListItemAvatar>
    )
    const href = Array.isArray(link) ? link.find(Boolean) : link
    const ishref = typeof(href) === "string" ? href.match(/^(https|http|www):/) : null
    const link_component = ishref ? (
        <IconButton edge="end" href={href} target="_blank">
            <Link />
        </IconButton>
    ) : null
    return (
        <Card variant="outlined" sx={{width: '100%', bgcolor: color_card}}>
            <ListItem
                secondaryAction={link ? link_component : null}
                sx={{minHeight: 60, pl: 1, pr: 1}}>
                {avatar ? avatar_component : null}
                <ListItemText sx={{ml: avatar ? 0 : 2}}
                    primary={<Typography color={color_text}>{primary}</Typography>}
                    secondary={<Typography color={color_text_sec}>{secondary}</Typography>}
                />
            </ListItem>
        </Card>
    )
}

export const DetailsListItemSkeleton = () => (
    <Skeleton variant="rounded" height={60} />
)

type DetailsChipsProps = {
    children?: React.ReactElement | React.ReactElement[];
    loading?: boolean
}

export const DetailsChips = ({children, loading}: DetailsChipsProps) => {
    const sources_disabled = useAppSelector(s => s.details.sources_disabled)
    return (
        <Stack direction="row" spacing={1}>
            <DetailsSwitch
                items={children}
                filter={filter_children_src(sources_disabled)}
                loading={loading}
                loading_component={<ChipsSkeleton n={5} />}
            />
        </Stack>
    )
}

export const ChipSkeleton = () => (
    <Skeleton variant="rounded" width={120} height={32} sx={{ borderRadius: 10}} />
)

export const ChipsSkeleton = ({n}: {n?: number}) => (
    <>
        {Array.from(Array(n == undefined ? 1 : n).keys()).map(n =>
            <Grid key={n} item><ChipSkeleton /></Grid>
        )}
    </>
)
