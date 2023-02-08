import "./styles.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Buffer } from "buffer";
import DetailsComponent from "./pages/details";
import SearchComponent from "./pages/search";
import DetailsJsonComponent from "./components/pad_json";

window.Buffer = Buffer;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SearchComponent />} />
                <Route path="/pad/:id" element={<DetailsComponent />} />
                <Route path="/raw/:id" element={<DetailsJsonComponent />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
