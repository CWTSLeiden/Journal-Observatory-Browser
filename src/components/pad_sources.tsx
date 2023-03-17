import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Stack, Switch, Typography, useTheme } from "@mui/material"
import React from "react"
import { ld_to_str } from "../query/ld"
import { labelize } from "../query/labels"
import { MaybeLink, todate } from "./pad"
import { colorize } from "./theme"
import { Source } from "@mui/icons-material"
import { useAppSelector } from "../store"

export const PadSourcesBar = () => {
    const sources = useAppSelector(s => s.details.sources)
    return (
        <Stack spacing={2} sx={{padding: 2, overflow: 'auto'}}>
            <Typography variant="h4">Sources</Typography>
            {Object.keys(sources).map(id => <PadSourceCard key={id} id={id} />)}
        </Stack>
    )
}

export const PadSourceCard = ({id}: {id: string}) => {
    const sources = useAppSelector(s => s.details.sources)
    const source = sources[id]
    if (!source) { return null }
    const creator = ld_to_str(source["dcterms:creator"])
    const created = todate(ld_to_str(source["dcterms:created"]))
    const license = ld_to_str(source["dcterms:license"])
    const license_link = <MaybeLink link={license} label={labelize(license)} />
    const toggle = <Switch checked={true} />
    const theme = useTheme()
    return (
        <Card sx={{width: '100%'}}>
            <CardHeader
                title={<Typography variant="h6">{labelize(creator)}</Typography>}
                avatar={<Avatar sx={{ bgcolor: theme.palette[colorize(creator)].main }}><Source /></Avatar>}
                action={toggle}
            />
            <CardContent sx={{ml: 2, pt: 0, pb: 0}}>
                <Typography color="text.secondary">
                    <b>Created: </b>{created}
                </Typography>
                <Typography color="text.secondary">
                    <b>Licence: </b>{license_link}
                </Typography>
            </CardContent>
            <CardActions>
                <Button href={id} target="_blank">Source</Button>
                <Button href={creator} target="_blank">Creator</Button>
            </CardActions>
        </Card>
    )
}
