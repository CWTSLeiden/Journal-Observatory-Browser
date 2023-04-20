import { Close } from "@mui/icons-material"
import { Alert, Collapse, IconButton, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import info from "../strings/info.json"

export const BetaWarning = () => {
    const [state, setState] = useState(window.sessionStorage.getItem('beta_warning_banner') || "open")
    
    useEffect(() => {
        window.sessionStorage.setItem('beta_warning_banner', state);
    }, [state]);

    const closebutton = (
        <IconButton size="small" onClick={() => setState("closed")} >
            <Close fontSize="inherit" />
        </IconButton>
    )
    return (
        <Box>
            <Collapse in={state === "open"}>
                <Alert severity="warning" action={closebutton} >
                    <ReactMarkdown components={{"p": Typography}} linkTarget="_blank">
                        {info["beta-warning"]}
                    </ReactMarkdown>
                </Alert>
            </Collapse>
        </Box>
    )
}
