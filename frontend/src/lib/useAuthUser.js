import { useAuth } from "@/context/AuthContext";

export const useAuthUser = () => {
    const { user } = useAuth();

    return {
        store: user, // Map backend user to store/user for compatibility with existing UI
        user: user,
        loginType: user?.role === "admin" ? "store" : "employee",
    };
};