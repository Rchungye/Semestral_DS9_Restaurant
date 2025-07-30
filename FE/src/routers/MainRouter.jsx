// src/routers/MainRouter.jsx - ACTUALIZADO
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "../pages/Home";
import Kitchen from "../pages/KitchenPage/kitchen.jsx";
import LoginPage from "../pages/LoginPage/Login.jsx";
import Admin from "../pages/AdminPage/Admin.jsx";
import AdminGuard from "../guards/AdminGuard.jsx";
import ChefGuard from "../guards/ChefGuard.jsx";
import useUserStore from "../store/userStore";
import Success from "../pages/Success.jsx";
import Cancel from "../pages/Cancel.jsx";

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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />

            {/* Protected routes with EXCLUSIVE access */}
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

            {/* Catch-all route for admin panel subroutes */}
            <Route
                path="/admin/*"
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