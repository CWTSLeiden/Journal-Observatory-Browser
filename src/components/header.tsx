import React from "react";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { LibraryBooks } from "@mui/icons-material";

const AppHeader = () => (
    <AppBar position="static" elevation={0}>
        <Container id="header-container">
            <Toolbar>
                <LibraryBooks sx={{paddingRight: '10px'}}/>
                <Typography component="h1" variant="h6">
                    Scholarly Communication Platform Browser
                </Typography>
            </Toolbar>
        </Container>
    </AppBar>
);

export default AppHeader;
