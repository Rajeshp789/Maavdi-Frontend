import { Link } from "react-router-dom";

function DesktopNav() {
    return (
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex gap-8 list-none">
                {["Home", "Products", "About", "Contact", "Reports"].map((item) => (
                    <li key={item}>
                        <Link
                            to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            className="text-gray-700 hover:text-indigo-600 transition duration-300 font-semibold relative group"
                        >
                            {item}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all" />
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default DesktopNav;
