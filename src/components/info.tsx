import { HelpOutlineTwoTone, Info } from "@mui/icons-material"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Typography } from "@mui/material"
import { grey } from "@mui/material/colors"
import React, { ReactElement, useContext, useState } from "react"
import ReactMarkdown from "react-markdown"
import infoStrings from "../strings/info.json"
import labelStrings from "../strings/labels.json"
import { labelize } from "../query/labels"
import { LabelContext } from "../store"


type InfoDialogProps = {
    property: string;
    text?: string | string[];
    icon?: ReactElement;
}
export const InfoDialog = ({property, text, icon}: InfoDialogProps) => {
    const [state, setState] = useState(false)
    const labels = useContext(LabelContext)
    const handleOpen = () => setState(true)
    const handleClose = () => setState(false)
    const iconbutton = icon ? icon : <IconButton color="inherit"><Info /></IconButton>
    const dialoglabel = labelStrings[property] || labelize(property, labels)
    const dialogtext = Array.isArray(text) ? text : infoStrings[text] || text || dialoglabel
    return (
        <>
            <Box onClick={handleOpen}>
                {iconbutton}
            </Box>
            <Dialog open={state} onClose={handleClose} scroll="paper">
                <DialogTitle>{dialoglabel}</DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        <ReactMarkdown components={{"div": Typography, "a": Link}} linkTarget="_blank">
                            {Array.isArray(dialogtext) ? dialogtext.join("\n") : dialogtext}
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

export const AnnotationDialog = ({property, text}: InfoDialogProps) => {
    const icon = (
        <IconButton
            sx={{ color: grey[400] }}
            size="small"
        >
            <HelpOutlineTwoTone fontSize="inherit" />
        </IconButton>
    )
    return (
        <InfoDialog
            property={property}
            text={text}
            icon={icon}
        />
    )
}
