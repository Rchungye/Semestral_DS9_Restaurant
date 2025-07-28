// src/routers/MainRouter.jsx
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "../pages/Home";
import PedirYa from "../pages/PedirYa";
import Kitchen from "../pages/Kitchen/kitchen.jsx";
import LoginPage from "../pages/Login/Login.jsx";
import Admin from "../pages/Admin/Admin.jsx";
import AdminGuard from "../guards/AdminGuard.jsx";
import ChefGuard from "../guards/ChefGuard.jsx";
import useUserStore from "../store/userStore";

const MainRouter = () => {
    const { initializeAuth } = useUserStore();

    // Initialize authentication when app starts
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/pedir-ya" element={<PedirYa />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
                path="/kitchen"
                element={
                    <ChefGuard>
                        <Kitchen />
                    </ChefGuard>
                }
            />
            <Route
                path="/admin"
                element={
                    <AdminGuard>
                        <Admin />
                    </AdminGuard>
                }
            />
        </Routes>
    );
};

export default MainRouter;