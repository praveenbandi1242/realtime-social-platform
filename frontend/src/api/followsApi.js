import api from "./axios";

export const followUser = async (userId) => {
    await api.post(`/users/${userId}/follow`);
};

export const unfollowUser = async (userId) => {
    await api.delete(`/users/${userId}/follow`);
};

export const getFollowers = async (
    userId,
    page = 0,
    size = 10
) => {
    const response = await api.get(
        `/users/${userId}/followers`,
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};

export const getFollowing = async (
    userId,
    page = 0,
    size = 10
) => {
    const response = await api.get(
        `/users/${userId}/following`,
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};