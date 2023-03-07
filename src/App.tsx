import "./styles.css";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { Container, Stack, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";

import AppHeader from "./components/header";
import AppRouter from "./AppRouter";
import store from "./store";
import { LabelContext, OntologyContext } from "./context";
import { ontology_store } from "./query/pad_store";
import { get_labels_dict } from "./query/labels";
import theme from "./components/theme";

window.Buffer = Buffer;
global.process.nextTick = setImmediate

function App() {
    const [ontology, setOntology] = useState(undefined)
    const [labels, setLabels] = useState(undefined)
    useEffect(() => {
        const render = async () => setOntology(await ontology_store())
        !ontology ? render() : null
    }, []);
    useEffect(() => {
        const render = async () => setLabels(await get_labels_dict(ontology))
        ontology && !labels ? render() : null
    }, [ontology]);
    
    return (
        <Stack spacing={2}>
            <AppHeader />
            <OntologyContext.Provider value={ontology}>
                <LabelContext.Provider value={labels}>
                    <Provider store={store}>
                        <ThemeProvider theme={theme}>
                            <Container id="content-container">
                                <AppRouter />
                            </Container>
                        </ThemeProvider>
                    </Provider>
                </LabelContext.Provider>
            </OntologyContext.Provider>
        </Stack>
    );
}

export default App;
