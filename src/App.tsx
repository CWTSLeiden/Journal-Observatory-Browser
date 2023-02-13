import React from "react";
import { Buffer } from "buffer";
import { Typography } from "@mui/material";

import AppRouter from "./AppRouter";
import "./styles.css";

window.Buffer = Buffer;

function App() {
    return (
        <div id="content-container">
            <Typography variant="h4">Scholarly Communication Platform Browser</Typography>
            <AppRouter />
        </div>
    );
}

export default App;
