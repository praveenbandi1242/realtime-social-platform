import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    login as loginApi,
    register as registerApi,
    logout as logoutApi
} from "../api/authApi";

import { getCurrentUser } from "../api/userApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const initializeAuth = async () => {

            const token =
                localStorage.getItem("accessToken");

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

            } catch {

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

            } finally {

                setLoading(false);
            }
        };

        initializeAuth();

    }, []);

    const login = async (credentials) => {

        const response =
            await loginApi(credentials);

        localStorage.setItem(
            "accessToken",
            response.accessToken
        );

        localStorage.setItem(
            "refreshToken",
            response.refreshToken
        );

        setUser(response.user);
    };

    const register = async (data) => {

        const response =
            await registerApi(data);

        localStorage.setItem(
            "accessToken",
            response.accessToken
        );

        localStorage.setItem(
            "refreshToken",
            response.refreshToken
        );

        setUser(response.user);
    };

    const logout = async () => {

        const refreshToken =
            localStorage.getItem("refreshToken");

        if (refreshToken) {
            try {
                await logoutApi(refreshToken);
            } catch {
                // Continue local logout.
            }
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);