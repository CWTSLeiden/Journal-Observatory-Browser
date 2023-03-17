import React, { ReactElement, useState } from "react";
import { Avatar, Badge, Box, Card, CardContent, CardHeader, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Skeleton, Stack, Tooltip } from "@mui/material";
import { ld_to_str } from "../query/ld";
import { labelize } from "../query/labels";
import { colorize } from "./theme";
import { Link } from "@mui/icons-material";
import { useAppSelector } from "../store";

export const SourceWrapper = ({src, children}: {src: string[], children?: ReactElement}) => {
    const sources_store = useAppSelector(s => s.details.sources)
    const sources_disabled = useAppSelector(s => s.details.sources_disabled)
    const sources_enabled = src.filter(s => !(sources_disabled.includes(s)))
    const sources = sources_enabled.map(s => sources_store[s])
    const creators = sources.map(s => ld_to_str(s["dcterms:creator"]))
    if (src.length > 0 && sources.length < 1) { return null }
    return (
        <Tooltip
            placement="top-end"
            title={creators.map(c => labelize(c)).join(", ")}
        >
            <Badge sx={{width: '100%'}}
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

type DetailsCardProps = {
    title: string;
    children?: React.ReactNode;
    loading?: boolean
}
export const DetailsCard = ({title, children, loading}: DetailsCardProps) => {
    const sources_disabled = useAppSelector(s => s.details.sources_disabled)
    const children_filtered = React.Children.toArray(children)
        .filter(filter_children_src(sources_disabled))
    let items = children_filtered
    if (children_filtered.length < 1 && loading) {
        items = [<DetailsListItemSkeleton key="0" />]
    }
    else if (children_filtered.length < 1) {
        items = [<DetailsListItem key="0" primary="Hidden" secondary="Expand source filter"/>]
    }
    return (
        <Card>
            <CardHeader
                title={title}
            />
            <Divider />
            <CardContent>
                <Stack direction="column" spacing={1}>
                    {items}
                </Stack>
            </CardContent>
        </Card>
)}

type DetailsListItemProps = {
    primary: string;
    secondary?: string;
    avatar?: ReactElement;
    link?: string;
    disabled?: boolean;
}
export const DetailsListItem = ({primary, secondary, avatar, link}: DetailsListItemProps) => {
    const avatar_component = (
        <ListItemAvatar>
            <Avatar>
                {avatar}
            </Avatar>
        </ListItemAvatar>
    )
    const link_component = (
        <IconButton edge="end" href={link} target="_blank">
            <Link />
        </IconButton>
    )
    return (
        <Card variant="outlined" sx={{width: '100%'}}>
            <ListItem
                secondaryAction={link ? link_component : null}
                sx={{height: 60, pl: 1, pr: 1}}>
                {avatar ? avatar_component : null}
                <ListItemText sx={{ml: avatar ? 0 : 2}}
                    primary={primary}
                    secondary={secondary}
                />
            </ListItem>
        </Card>
    )
}

export const DetailsListItemSkeleton = () => (
    <Skeleton variant="rounded" height={60} />
)

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
function useAppContext(arg0: (s: any) => any) {
    throw new Error("Function not implemented.");
}

