import React, { useState } from "react";
import { AppBar, Button, Container, Dialog, DialogContent, DialogActions, DialogTitle, IconButton, Link, Toolbar, Typography } from "@mui/material";
import { LibraryBooks, Info } from "@mui/icons-material";

const AppHeader = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

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
                    <IconButton color="inherit" onClick={handleClickOpen}>
                        <Info />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>
                            About Scholarly Communication Platform Browser
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" align="justify" paragraph>
                                Scholarly Communication Platform Browser has been developed by Bram van den Boomen and Nees Jan van Eck at the Centre for Science and Technology Studies (CWTS) at Leiden University.
                            </Typography>
                            <Typography variant="body1" align="justify" paragraph>
                                This prototype has been developed to demonstrate the value of the Scholarly Communication Platform Framework developed in the Journal Observatory project funded by the Dutch Research Council (NWO).
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppHeader;
