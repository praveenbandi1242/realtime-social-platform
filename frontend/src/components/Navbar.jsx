import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const { logout } = useAuth();

    return (
        <nav className="navbar">

            <Link to="/" className="logo">

                <span className="logo-mark">
                    C
                </span>

                <span>
                    Connect
                </span>

            </Link>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/search">
                    Search
                </Link>

                <Link to="/profile">
                    Profile
                </Link>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </nav>
    );
};

export default Navbar;