import "./styles.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Buffer } from "buffer";
import DetailsComponent from "./pages/details";
import SearchComponent from "./pages/search";
import DetailsJsonComponent from "./components/pad_json";
import { Provider } from "react-redux";
import store from "./store";

window.Buffer = Buffer;

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SearchComponent />} />
                    <Route path="/pad/:id" element={<DetailsComponent />} />
                    <Route path="/raw/:id" element={<DetailsJsonComponent />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
