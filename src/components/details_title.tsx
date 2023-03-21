import React, { useState, useEffect, useContext } from "react";
import { PadContext } from "../context";
import { query_select_first } from "../query/local";
import { Quadstore } from "quadstore";
import { Box, Skeleton, Typography } from "@mui/material";

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
        <Box sx={{mt: 8, mb: 4}}>
            <Typography align="center" variant="h3">
                {!name && loading ? loadingview : name}
            </Typography>
            <Typography align="center" variant="caption">
                {!pad_id && loading ? loadingview : pad_id}
            </Typography>
        </Box>
    )
}

async function platform_name(store: Quadstore) {
    const query = `
        select ?name where {
            ?pad a pad:PAD ;
                pad:hasAssertion ?assertion .
            graph ?assertion {
                ?s a ppo:Platform ;
                    schema:name ?name .
            }
        }
    `;
    const result = await query_select_first(query, store)
    const name = result && result.get("name") ? result.get("name").value : "Unnamed Platform"
    return name
}
