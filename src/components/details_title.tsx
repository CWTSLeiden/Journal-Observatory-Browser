import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../store";
import { query_select_first } from "../query/local";
import { Quadstore } from "quadstore";
import { Box, Skeleton, Tooltip, Typography } from "@mui/material";
import { compact_id } from "../query/jsonld_helpers";

export const PlatformTitle = ({pad_id}: {pad_id?: string}) => {
    const [name, setName] = useState<string>();
    const [loading, setLoading] = useState(true);
    const padStore = useContext(PadContext)
    useEffect(() => {
        const render = async () => {
            setName(await platform_name(padStore))
            setLoading(false)
        }
        padStore ? render() : null
    }, [padStore]);
    const loadingview = <Skeleton variant="text" />

    return (
        <Box sx={{mt: 4, mb: 2}}>
            <Tooltip title={compact_id(pad_id)} placement="top">
                <Typography align="center" variant="h5">
                    {!name && loading ? loadingview : name}
                </Typography>
            </Tooltip>
        </Box>
    )
}

async function platform_name(store: Quadstore) {
    const query = `
        select ?name where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion {
                ?s a scpo:Platform ;
                    schema:name ?name .
            }
        }
    `;
    const result = await query_select_first(query, store)
    const name = result && result.get("name") ? result.get("name").value : "Unnamed Platform"
    return name
}
