import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Kitchen from "../pages/kitchen"

const MainRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kitchen" element={<Kitchen />} />
        </Routes>
    );
};

export default MainRouter;
