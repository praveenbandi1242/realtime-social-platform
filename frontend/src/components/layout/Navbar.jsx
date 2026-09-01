import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="navbar">
            <Link
                to="/"
                className="brand"
            >
                Socially
            </Link>

            <div className="navbar-actions">
                <button
                    className="icon-button"
                    aria-label="Search"
                >
                    ⌕
                </button>

                <button
                    className="icon-button"
                    aria-label="Notifications"
                >
                    ♧
                </button>

                <div className="avatar avatar-small">
                    U
                </div>
            </div>
        </header>
    );
}