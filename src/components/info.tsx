import { HelpOutlineTwoTone } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material"
import { grey } from "@mui/material/colors"
import React, { useContext, useState } from "react"
import ReactMarkdown from "react-markdown"
import info from "../strings/info.json"
import { labelize } from "../query/labels"
import { LabelContext } from "../store"

export const InfoDialog = ({property, text}: {property: string, text?: string | string[]}) => {
    const [state, setState] = useState(false)
    const labels = useContext(LabelContext)
    const handleOpen = () => setState(true)
    const handleClose = () => setState(false)
    const dialogtext = Array.isArray(text) ? text.join("\n") : text || info[property]
    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{ color: grey[400] }}
                size="small"
            >
                <HelpOutlineTwoTone fontSize="inherit" />
            </IconButton>
            <Dialog open={state} onClose={handleClose} scroll="paper">
                <DialogTitle>
                    {labelize(property, labels)}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        <ReactMarkdown>
                            {dialogtext}
                        </ReactMarkdown>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
