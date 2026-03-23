import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Wait until auth state is known
    if (loading) {
        return <div>Loading...</div>;
    }

    // Not logged in → redirect
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Logged in → allow access
    return <Outlet />;
};

export default ProtectedRoute;
