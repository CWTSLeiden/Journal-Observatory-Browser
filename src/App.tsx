import "./styles.css";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { Container, Stack } from "@mui/material";
import { Provider } from "react-redux";

import AppHeader from "./components/header";
import AppRouter from "./AppRouter";
import store from "./store";
import { AppContext } from "./context";
import { ontology_store } from "./query/query";
import { QueryEngine } from "@comunica/query-sparql";

window.Buffer = Buffer;

function App() {
    const sparqlEngine = new QueryEngine()
    const context: AppContext = { sparqlEngine }
    const [appContext, setAppContext] = useState(context)
    async function getStore() {
        if (!appContext.ontologyStore) {
            console.log("Set ontologystore")
            const ontologyStore = await ontology_store(sparqlEngine)
            setAppContext({...appContext, ontologyStore})
        }
    }
    useEffect(() => {getStore()}, []);
    
    return (
        <Stack spacing={2}>
            <AppHeader />
            <AppContext.Provider value={appContext}>
                <Provider store={store}>
                    <Container id="content-container">
                        <AppRouter />
                    </Container>
                </Provider>
            </AppContext.Provider>
        </Stack>
    );
}

export default App;
