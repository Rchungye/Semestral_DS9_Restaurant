// src/hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";

export const useLogout = (redirectTo = "/login") => {
    const navigate = useNavigate();
    const { logout, isLoading } = useUserStore();

    const handleLogout = async () => {
        try {
            await logout();
            navigate(redirectTo);
        } catch (error) {
            console.error("Error during logout:", error);
            // Navigate to login anyway even if logout fails
            navigate(redirectTo);
        }
    };

    return {
        handleLogout,
        isLoading
    };
};