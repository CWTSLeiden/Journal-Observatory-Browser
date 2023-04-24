import React from "react";
import { AppBar, Grid, IconTypeMap, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { GitHub, LibraryBooks, UnarchiveOutlined, WebhookOutlined } from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type AppHeaderProps = {
    text: string;
    href: string;
    Icon?: OverridableComponent<IconTypeMap>;
}
const AppHeader = () => {
    const Link = ({text, href, Icon}: AppHeaderProps) => (
        <ListItem disablePadding>
        <ListItemButton href={href} target="_blank">
            {Icon ? (
                <ListItemIcon sx={{color: 'inherit'}}>
                    <Icon fontSize="small"/>
                </ListItemIcon>
            ) : null}
            <ListItemText inset={!(Icon)} sx={{color: 'inherit'}}>
                <Typography sx={{ textDecoration: "none" }}>{text}</Typography>
            </ListItemText>
        </ListItemButton>
        </ListItem>
    )
    return (
        <AppBar position="static" elevation={0}>
            <Grid container
                sx={{
                    maxWidth: "1440px",
                    ml: "auto",
                    mr: "auto",
                    pt: 4,
                    pb: 4,
                }}
                spacing={2}
            >
                <Grid item xs={12}>
                    <Typography variant="h5">Journal Observatory Browser</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <List>
                        <Typography variant="h6">Source code</Typography>
                        <Link href="https://github.com/orgs/CWTSLeiden/Journal-Observatory-Browser" text="Journal Observatory Browser" Icon={GitHub} />
                        <Link href="https://github.com/orgs/CWTSLeiden/Journal-Observatory-backend" text="Journal Observatory Backend" Icon={GitHub} />
                        <Link href="https://github.com/orgs/CWTSLeiden/Journal-Observatory-data" text="Journal Observatory Data" Icon={GitHub} />
                        <Link href="https://github.com/orgs/CWTSLeiden/Journal-Observatory-framework" text="Scholarly Communication Platform Framework" Icon={GitHub} />
                    </List>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <List>
                        <Typography variant="h6">Linked data</Typography>
                        <Link href="https://sparql.journalobservatory.org/sparql" text="SPARQL Endpoint" Icon={WebhookOutlined} />
                        <Link href="https://api.journalobservatory.org" text="REST API" Icon={UnarchiveOutlined} />
                    </List>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <List>
                        <Typography variant="h6">Documentation</Typography>
                        <Link href="https://www.journalobservatory.org" text="Journal Observatory Project" Icon={LibraryBooks} />
                        <Link href="https://www.journalobservatory.org/prototype" text="Journal Observatory Browser" Icon={LibraryBooks} />
                        <Link href="https://www.journalobservatory.org/framework" text="Scholarly Communication Platform Framework" Icon={LibraryBooks} />
                    </List>
                </Grid>
            </Grid>
        </AppBar>
    );
};

export default AppHeader;
