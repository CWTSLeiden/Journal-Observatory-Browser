import "./styles.css";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { Container, Stack } from "@mui/material";
import { Provider } from "react-redux";

import AppHeader from "./components/header";
import AppRouter from "./AppRouter";
import store from "./store";
import { AppContext } from "./context";
import { ontology_store } from "./query/pad_store";
import { get_labels_dict } from "./query/labels";

window.Buffer = Buffer;
global.process.nextTick = setImmediate

function App() {
    const context: AppContext = {}
    const [appContext, setAppContext] = useState(context)
    async function getStore() {
        if (!appContext.ontologyStore) {
            const ontologyStore = await ontology_store()
            setAppContext({...appContext, ontologyStore})
            const labels_dict = await get_labels_dict(ontologyStore)
            setAppContext({...appContext, labels: labels_dict})
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
