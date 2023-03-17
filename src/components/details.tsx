import React, { useContext, ReactElement, useState } from "react";
import { Avatar, Badge, Box, Card, CardContent, CardHeader, IconButton, ListItem, ListItemAvatar, ListItemText, Paper } from "@mui/material";
import { ld_to_str } from "../query/ld";
import { SourcesContext } from "../context";
import { labelize } from "../query/labels";
import { colorize } from "./theme";
import { Link } from "@mui/icons-material";

export const SourceWrapper = ({src, children}: {src: string[], children?: ReactElement}) => {
    const [state, setState] = useState<boolean>(false)
    const sources_store = useContext(SourcesContext)
    const sources = src.map(s => sources_store.find((e) => e["@id"] == s))
    const creators = sources.map(s => ld_to_str(s["dcterms:creator"]))
    return (
        <Box sx={{width: '100%'}}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <Badge sx={{width: '100%'}}
                badgeContent={state ? creators.map(c => labelize(c)).join(", ") : sources.length }
                color={sources.length > 1 ? "primary" : colorize(creators.find(Boolean))}
                variant={sources.length > 1 || state ? "standard" : "dot"}
                invisible={sources.length < 1}
            >
                {children}
            </Badge>
        </Box>
    )
}

type DetailsCardProps = {
    title: string;
    children?: ReactElement | ReactElement[];
}
export const DetailsCard = ({title, children}: DetailsCardProps) => (
    <Card sx={{minHeight: 200}}>
        <CardHeader
            title={title}
        />
        <CardContent>
            {children}
        </CardContent>
    </Card>
)

type DetailsListItemProps = {
    primary: string;
    secondary?: string;
    avatar?: ReactElement;
    link?: string;
}
export const DetailsListItem = ({primary, secondary, avatar, link}: DetailsListItemProps) => {
    console.log(link)
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
        <ListItem
            secondaryAction={link ? link_component : null}
            component={Paper}
            sx={{height: 60, pl: 1, pr: 1}}>
            {avatar ? avatar_component : null}
            <ListItemText sx={{ml: avatar ? 0 : 2}}
                primary={primary}
                secondary={secondary}
            />
        </ListItem>
    )
}
