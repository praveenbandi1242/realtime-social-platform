import api from "./axios";

export const getCurrentUser = async () => {
    const response = await api.get("api/users/me");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put("api/users/me", data);
    return response.data;
};

export const changePassword = async (data) => {
    await api.put("api/users/me/password", data);
};

export const searchUsers = async (query, page = 0) => {
    const response = await api.get("api/users/search", {
        params: {
            query,
            page,
            size: 10
        }
    });

    return response.data;
};

export const deactivateAccount = async () => {
    await api.delete("api/users/me");
};