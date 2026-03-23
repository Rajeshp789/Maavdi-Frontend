import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

// ================================
// Auth Context
// ================================
const AuthContext = createContext(null);

// ================================
// Auth Provider
// ================================
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAuthenticated = !!user;

    // 🔑 Check login state on app load
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`, {
                    withCredentials: true
                });

                // console.log(res.data.user);
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, []);


    // Login handler
    const login = (userData) => {
        try {
            // console.log("THIS IS AUTHCONTEXT LOGIN FUNCTION :", userData);
            setUser(userData);
            setError(null);
        } catch (err) {
            setError("Login failed");
        }
    };

    // Logout
    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error(err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                error,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ================================
// Custom Hook
// ================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
