import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

function AuthIcons({ cartCount }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse" />;
    }

    return isAuthenticated ? (
        <>
            <Link to="/wishlist" className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-red-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </Link>

            <Link to="/cart" className="relative p-1 md:p-2 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </Link>

            <Link to="/orders" className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </Link>

            <Link to="/profile" className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-indigo-600 transition" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </Link>
        </>
    ) : (
        <Link
            to="/login"
            className="px-3 md:px-4 py-1.5 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-sm md:text-base"
        >
            Login
        </Link>
    );
}

export default AuthIcons;
