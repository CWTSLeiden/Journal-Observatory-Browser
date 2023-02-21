import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DetailsComponent from "./pages/details";
import SearchComponent from "./pages/search";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SearchComponent />} />
                <Route path="/pad/:id" element={<DetailsComponent />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;
