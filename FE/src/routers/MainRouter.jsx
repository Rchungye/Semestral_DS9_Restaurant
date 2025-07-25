import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import PedirYa from "../pages/PedirYa";
import Kitchen from "../pages/kitchen"
import LoginPage from "../pages/Login";
import Admin from "../pages/Admin";

const MainRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pedir-ya" element={<PedirYa />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
    );
};

export default MainRouter;
