import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DetailsComponent from "./pages/details";
import SearchComponent from "./pages/search";
import DetailsJsonComponent from "./components/pad_json";

function AppRouter() {
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

export default AppRouter;
