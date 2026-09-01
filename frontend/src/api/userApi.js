import api from "./axios";

export const getCurrentUser = async () => {
    const response = await api.get("/users/me");

    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put(
        "/users/me",
        data
    );

    return response.data;
};

export const changePassword = async (data) => {
    await api.put(
        "/users/me/password",
        data
    );
};

export const searchUsers = async (
    query,
    page = 0
) => {
    const response = await api.get(
        "/users/search",
        {
            params: {
                query,
                page,
                size: 10,
            },
        }
    );

    return response.data;
};

export const deactivateAccount = async () => {
    await api.delete("/users/me");
};

export const getUserById = async (userId) => {
    const response = await api.get(
        `/users/${userId}`
    );

    return response.data;
};

