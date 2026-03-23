import { Link } from "react-router-dom";

function MobileMenu({ isOpen, setIsOpen, isAuthenticated }) {
    if (!isOpen) return null;

    return (
        <div className="md:hidden bg-white border-t-2 border-indigo-600 shadow-lg">
            <ul className="flex flex-col gap-3 list-none p-4">
                {["Home", "Products", "About", "Contact"].map((item) => (
                    <li key={item}>
                        <Link
                            to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 hover:text-indigo-600 font-semibold text-sm"
                        >
                            {item}
                        </Link>
                    </li>
                ))}

                <li className="border-t border-gray-200 pt-3 mt-2">
                    {isAuthenticated ? (
                        <Link to="/profile" onClick={() => setIsOpen(false)}>👤 Profile</Link>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)}>🔓 Login</Link>
                    )}
                </li>
            </ul>
        </div>
    );
}

export default MobileMenu;
