import React from "react";
import { AppBar, Grid, IconTypeMap, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { LibraryBooks } from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type AppHeaderProps = {
    text: string;
    href: string;
    Icon?: OverridableComponent<IconTypeMap>;
}
const AppHeader = () => {
    const Link = ({text, href, Icon}: AppHeaderProps) => (
        <ListItemButton href={href} target="_blank">
            {Icon ? (
                <ListItemIcon sx={{color: 'inherit'}}>
                    <Icon fontSize="small"/>
                </ListItemIcon>
            ) : null}
            <ListItemText inset={!(Icon)} sx={{color: 'inherit'}}>
                <Typography sx={{ textDecoration: "underline" }}>{text}</Typography>
            </ListItemText>
        </ListItemButton>
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
                    <Typography variant="h5">Header</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <List>
                        <Typography variant="h6">Subheader</Typography>
                        <Link href="/" text="Link" Icon={LibraryBooks} />
                        <Link href="/" text="Link" />
                    </List>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <List>
                        <Typography variant="h6">Subheader</Typography>
                        <Link href="/" text="Link" Icon={LibraryBooks} />
                        <Link href="/" text="Link" />
                    </List>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <List>
                        <Typography variant="h6">Subheader</Typography>
                        <Link href="/" text="Link" Icon={LibraryBooks} />
                        <Link href="/" text="Link" />
                    </List>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <List>
                        <Typography variant="h6">Subheader</Typography>
                        <Link href="/" text="Link" Icon={LibraryBooks} />
                        <Link href="/" text="Link" />
                    </List>
                </Grid>
            </Grid>
        </AppBar>
    );
};

export default AppHeader;
