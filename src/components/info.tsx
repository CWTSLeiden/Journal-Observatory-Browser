import { HelpOutlineTwoTone } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material"
import { grey } from "@mui/material/colors"
import React, { useContext, useState } from "react"
import ReactMarkdown from "react-markdown"
import { info } from "../config"
import { labelize } from "../query/labels"
import { LabelContext } from "../store"

export const InfoDialog = ({property, text}: {property: string, text?: string}) => {
    const [state, setState] = useState(false)
    const labels = useContext(LabelContext)
    const handleOpen = () => setState(true)
    const handleClose = () => setState(false)
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
                    <Typography variant="h5">
                        {labelize(property, labels)}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <ReactMarkdown>
                            {text || info[property]}
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
