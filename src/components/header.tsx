import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import React from "react";

const AppHeader = () => (
    <AppBar position="static" elevation={0}>
        <Toolbar>
            <Typography variant="h6">
                Scholarly Communication Platform Browser
            </Typography>
        </Toolbar>
    </AppBar>
);

export default AppHeader;
