import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sidebar">

            <nav>

                <NavLink to="/">
                    <span>⌂</span>
                    Home
                </NavLink>


                <NavLink to="/explore">
                    <span>⌕</span>
                    Explore
                </NavLink>


                <NavLink to="/notifications">
                    <span>♧</span>
                    Notifications
                </NavLink>


                <NavLink to="/messages">
                    <span>💬</span>
                    Messages
                </NavLink>


                <NavLink to="/profile">
                    <span>◎</span>
                    Profile
                </NavLink>

            </nav>

        </aside>
    );
}

