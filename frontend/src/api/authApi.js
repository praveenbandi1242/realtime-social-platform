import api from "./axios";

export const register = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const refreshToken = async (refreshToken) => {
    const response = await api.post("/auth/refresh", {
        refreshToken,
    });

    return response.data;
};

export const logout = async (refreshToken) => {
    await api.post("/auth/logout", {
        refreshToken,
    });
};

