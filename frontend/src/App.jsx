import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import UserSearch from "./pages/UserSearch";
import NotificationsPage from "./pages/NotificationsPage";
import UserProfile from "./pages/UserProfile";
import Connections from "./pages/Connections";
import Messages from "./pages/Messages";

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>

                <Routes>

                    {/* =========================
                        PUBLIC ROUTES
                    ========================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* =========================
                        NORMAL APPLICATION
                        WITH SIDEBAR
                    ========================= */}

                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >

                        <Route
                            path="/"
                            element={<HomePage />}
                        />

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/users/:userId"
                            element={<UserProfile />}
                        />

                        <Route
                            path="/connections"
                            element={<Connections />}
                        />

                        <Route
                            path="/search"
                            element={<UserSearch />}
                        />

                        <Route
                            path="/notifications"
                            element={<NotificationsPage />}
                        />

                    </Route>


                    {/* =========================
                        FULL-SCREEN MESSAGES
                    ========================= */}

                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <Messages />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;