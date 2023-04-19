import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import React from "react";

const AppHeader = () => (
    <AppBar position="static" elevation={0}>
        <Container id="header-container">
            <Toolbar>
                <Typography component="h1" variant="h6">
                    Journal Observatory Browser
                </Typography>
            </Toolbar>
        </Container>
    </AppBar>
);

export default AppHeader;
