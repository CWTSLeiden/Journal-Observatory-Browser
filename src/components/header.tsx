import React from "react";
import { AppBar, Container, Link, Toolbar, Typography } from "@mui/material";
import { LibraryBooks } from "@mui/icons-material";

const AppHeader = () => (
    <AppBar position="static" elevation={0}>
        <Container id="header-container">
            <Toolbar>
                <Link href="/" color="inherit" underline="none">
                    <LibraryBooks sx={{paddingRight: '10px'}}/>
                </Link>
                <Typography href="/" component="a" variant="h6" sx={{color: 'inherit', textDecoration: 'none'}}>
                    Scholarly Communication Platform Browser
                </Typography>
            </Toolbar>
        </Container>
    </AppBar>
);

export default AppHeader;
