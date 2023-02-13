import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import DetailsComponent from "./pages/details";
import SearchComponent from "./pages/search";
import DetailsJsonComponent from "./components/pad_json";
import store from "./store";

function AppRouter() {
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
    )
}

export default AppRouter;
