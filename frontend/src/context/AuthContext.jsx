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

    const [token, setToken] = useState(
        () => localStorage.getItem("accessToken")
    );

    const [loading, setLoading] = useState(true);


    /* =====================================================
       INITIALIZE AUTH
    ===================================================== */

    useEffect(() => {

        const initializeAuth = async () => {

            const accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {

                setLoading(false);

                return;
            }

            try {

                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

                setToken(accessToken);

            } catch {

                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "refreshToken"
                );

                setToken(null);

                setUser(null);

            } finally {

                setLoading(false);
            }
        };

        initializeAuth();

    }, []);


    /* =====================================================
       LOGIN
    ===================================================== */

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


        setToken(
            response.accessToken
        );

        setUser(
            response.user
        );
    };


    /* =====================================================
       REGISTER
    ===================================================== */

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


        setToken(
            response.accessToken
        );

        setUser(
            response.user
        );
    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout = async () => {

        const refreshToken =
            localStorage.getItem("refreshToken");


        if (refreshToken) {

            try {

                await logoutApi(
                    refreshToken
                );

            } catch {

                // Continue local logout.
            }
        }


        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );


        setToken(null);

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
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


export const useAuth = () =>
    useContext(AuthContext);