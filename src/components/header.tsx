import React from "react";
import { AppBar, Container, Link, Toolbar, Typography } from "@mui/material";
import { LibraryBooks } from "@mui/icons-material";
import { InfoDialog } from "./info";

const AppHeader = () => {
    return (
        <AppBar position="static" elevation={0}>
            <Container id="header-container">
                <Toolbar>
                    <Link href="/" color="inherit" underline="none">
                        <LibraryBooks sx={{paddingRight: '10px'}}/>
                    </Link>
                    <Typography href="/" component="a" variant="h5" sx={{color: 'inherit', textDecoration: 'none', flexGrow: 1}}>
                        Journal Observatory Browser
                    </Typography>
                    <InfoDialog property="about-title" text="about-text" />
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppHeader;
