import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

import {
    Home,
    Search,
    Users,
    Bell,
    MessageCircle,
    UserRound,
    LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../users/UserAvatar";


const AppLayout = () => {

    const { user, logout } = useAuth();

    const navigate = useNavigate();


    const handleLogout = async () => {

        try {
            await logout();
        } finally {
            navigate("/login", {
                replace: true,
            });
        }
    };


    const getFullName = () => {

        const name =
            `${user?.firstName || ""} ${
                user?.lastName || ""
            }`.trim();

        return (
            name ||
            user?.username ||
            "User"
        );
    };


    const navigation = [

        {
            to: "/",
            label: "Home",
            icon: Home,
            end: true,
        },

        {
            to: "/search",
            label: "Search",
            icon: Search,
        },

        {
            to: "/connections",
            label: "Connections",
            icon: Users,
        },

        {
            to: "/messages",
            label: "Messages",
            icon: MessageCircle,
        },

        {
            to: "/notifications",
            label: "Notifications",
            icon: Bell,
        },

        {
            to: "/profile",
            label: "Profile",
            icon: UserRound,
        },
    ];


    console.log(
        "AppLayout rendered",
        user
    );


    return (
        <div className="app-shell">

            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <aside className="sidebar">

                {/* BRAND */}

                <NavLink
                    to="/"
                    className="app-brand"
                >

                    <span className="app-brand-mark">
                        C
                    </span>

                    <span>
                        CConnect
                    </span>

                </NavLink>


                {/* NAVIGATION */}

                <nav className="sidebar-navigation">

                    {navigation.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `sidebar-link ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >

                                <span className="sidebar-icon">

                                    <Icon
                                        size={19}
                                        strokeWidth={2}
                                    />

                                </span>

                                <span>
                                    {item.label}
                                </span>

                            </NavLink>
                        );

                    })}

                </nav>


                {/* ==========================================
                    BOTTOM USER SECTION
                ========================================== */}

                <div className="sidebar-bottom">

                    <div className="mini-user">

                        <UserAvatar
                            user={user}
                            size="small"
                        />

                        <div className="mini-user-info">

                            <strong>
                                {getFullName()}
                            </strong>

                            <span>
                                @{user?.username}
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >

                        <LogOut size={16} />

                        <span>
                            Log out
                        </span>

                    </button>

                </div>

            </aside>


            {/* ==========================================
                MAIN APPLICATION
            ========================================== */}

            <main className="app-main">

                <Outlet />

            </main>

        </div>
    );
};


export default AppLayout;