import React from "react";
import { Buffer } from "buffer";
import { Container, Stack } from "@mui/material";
import "./styles.css";
import AppHeader from "./components/header";
import AppRouter from "./AppRouter";

window.Buffer = Buffer;

function App() {
    return (
        <Stack spacing={2}>
            <AppHeader />
            <Container id="content-container">
                <AppRouter />
            </Container>
        </Stack>
    );
}

export default App;
