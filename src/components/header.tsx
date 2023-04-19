import React, { useState } from "react";
import { AppBar, Button, Container, Dialog, DialogContent, DialogActions, DialogTitle, IconButton, Link, Toolbar, Typography } from "@mui/material";
import { LibraryBooks, Info } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { info } from "../config";

const AppHeader = () => {
    const [infoDialogState, setInfoDialogState] = useState(false);
    const handleOpenInfoDialog = () => setInfoDialogState(true);
    const handlCloseInfoDialog = () => setInfoDialogState(false);

    return (
        <AppBar position="static" elevation={0}>
            <Container id="header-container">
                <Toolbar>
                    <Link href="/" color="inherit" underline="none">
                        <LibraryBooks sx={{paddingRight: '10px'}}/>
                    </Link>
                    <Typography href="/" component="a" variant="h6" sx={{color: 'inherit', textDecoration: 'none', flexGrow: 1}}>
                        Scholarly Communication Platform Browser
                    </Typography>
                    <IconButton color="inherit" onClick={handleOpenInfoDialog}>
                        <Info />
                    </IconButton>
                    <Dialog open={infoDialogState} onClose={handlCloseInfoDialog} scroll="paper">
                        <DialogTitle>
                            {info["about-title"]}
                        </DialogTitle>
                        <DialogContent>
                            <ReactMarkdown>
                                {info["about-text"]}
                            </ReactMarkdown>
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
