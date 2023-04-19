import React, { useState } from "react";
import { AppBar, Button, Container, Dialog, DialogContent, DialogActions, DialogTitle, IconButton, Link, Toolbar, Typography, DialogContentText } from "@mui/material";
import { LibraryBooks, Info } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import info from "../strings/info.json";

const AppHeader = () => {
    const [infoDialogState, setInfoDialogState] = useState(false);
    const handleOpenInfoDialog = () => setInfoDialogState(true);
    const handlCloseInfoDialog = () => setInfoDialogState(false);
    const abouttitle = info["about-title"]
    const abouttext = info["about-text"]
    const dialogtext = Array.isArray(abouttext) ? abouttext.join("\n") : abouttext

    return (
        <AppBar position="static" elevation={0}>
            <Container id="header-container">
                <Toolbar>
                    <Link href="/" color="inherit" underline="none">
                        <LibraryBooks sx={{paddingRight: '10px'}}/>
                    </Link>
                    <Typography href="/" component="a" variant="h6" sx={{color: 'inherit', textDecoration: 'none', flexGrow: 1}}>
                        Journal Observatory Browser
                    </Typography>
                    <IconButton color="inherit" onClick={handleOpenInfoDialog}>
                        <Info />
                    </IconButton>
                    <Dialog open={infoDialogState} onClose={handlCloseInfoDialog} scroll="paper">
                        <DialogTitle>
                            {abouttitle}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText component="div">
                                <ReactMarkdown>
                                    {dialogtext}
                                </ReactMarkdown>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handlCloseInfoDialog}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppHeader;
