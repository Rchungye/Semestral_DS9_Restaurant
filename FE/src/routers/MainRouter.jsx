import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "../components/Welcome";

const MainRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
        </Routes>
    );
};

export default MainRouter;
