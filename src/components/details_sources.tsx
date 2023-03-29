import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Drawer, IconButton, Stack, Switch, Toolbar, Typography, useTheme } from "@mui/material"
import React from "react"
import { first, ld_to_str, todate } from "../query/jsonld_helpers"
import { labelize } from "../query/labels"
import { MaybeLink } from "./details"
import { colorize } from "./theme"
import { ChevronRight, Source } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../store"
import * as actions from "../store/details"
import { expand_id } from "../query/jsonld_helpers"

export const sort_sources_keys = (sources: object) => {
    const key_date = Object.entries(sources).map(([id, source]) => [id, first(source, "dcterms:created")])
    const sort_tuple = (t1: [string, string], t2: [string, string]) => {
        const [,d1] = t1
        const [,d2] = t2
        if (d1 < d2) { return 1 }
        if (d1 > d2) { return -1 }
        return 0
    }
    return key_date.sort(sort_tuple).map(([id,]) => id)
}

export const PadSourcesBar = ({width}: {width: number}) => {
    const sources = useAppSelector(s => s.details.sources)
    const sidebar = useAppSelector(s => s.details.sidebar)
    const dispatch = useAppDispatch()
    return (
        <Drawer
            variant="persistent" 
            open={sidebar}
            anchor="right"
        >
            <Box sx={{ width }} />
            <Toolbar>
                <IconButton onClick={() => dispatch(actions.sidebar_set(false))}>
                    <ChevronRight />
                </IconButton>
            </Toolbar>
            <Divider />
            <Stack spacing={2} sx={{padding: 2, overflow: 'auto'}}>
                <Typography variant="h4">Sources</Typography>
                {sort_sources_keys(sources).map(id => <PadSourceCard key={id} id={id} />)}
            </Stack>
        </Drawer>
    )
}

export const PadSourceCard = ({id}: {id: string}) => {
    const theme = useTheme()
    const sources = useAppSelector(s => s.details.sources)
    const sources_disabled = useAppSelector(s => s.details.sources_disabled)
    const dispatch = useAppDispatch()

    const source = sources[id]
    if (!source) { return null }
    const creator = ld_to_str(source["dcterms:creator"])
    const created = todate(ld_to_str(source["dcterms:created"]))
    const license = ld_to_str(source["dcterms:license"])
    const license_link = <MaybeLink link={license} label={labelize(license)} />
    const disabled = sources_disabled.includes(id)
    const handleToggle = () => dispatch(disabled ? actions.source_enable(id) : actions.source_disable(id))
    const toggle = <Switch checked={!(disabled)} onClick={handleToggle} />

    const color_text = disabled ? theme.palette.grey[400] : theme.palette.text.primary
    const color_accent = disabled ? theme.palette.grey[400] : theme.palette[colorize(creator)].main
    const color_card = disabled ? theme.palette.grey[100] : null
    return (
        <Card
            variant="outlined"
            sx={{ bgcolor: color_card }}
        >
            <CardHeader
                title={<Typography variant="h6" color={color_text}>{labelize(creator)}</Typography>}
                avatar={<Avatar sx={{ bgcolor: color_accent }}><Source /></Avatar>}
                action={toggle}
            />
            <CardContent sx={{ml: 2, pt: 0, pb: 0}}>
                <Typography color={color_text}>
                    <b>Created: </b>{created}
                </Typography>
                <Typography color={color_text}>
                    <b>Licence: </b>{license_link}
                </Typography>
            </CardContent>
            <CardActions>
                <Button href={expand_id(id)} target="_blank">Source</Button>
                <Button href={creator} target="_blank">Creator</Button>
            </CardActions>
        </Card>
    )
}
