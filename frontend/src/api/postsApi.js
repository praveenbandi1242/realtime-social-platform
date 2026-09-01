
import api from "./axios";

export const getPosts = async (
    page = 0,
    size = 10
) => {
    const response = await api.get(
        "/posts",
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};

export const getPost = async (postId) => {
    const response = await api.get(
        `/posts/${postId}`
    );

    return response.data;
};

export const createPost = async (data) => {
    const response = await api.post(
        "/posts",
        data
    );

    return response.data;
};

export const updatePost = async (
    postId,
    data
) => {
    const response = await api.put(
        `/posts/${postId}`,
        data
    );

    return response.data;
};

export const deletePost = async (postId) => {
    await api.delete(
        `/posts/${postId}`
    );
};

export const likePost = async (postId) => {
    await api.post(
        `/posts/${postId}/like`
    );
};

export const unlikePost = async (postId) => {
    await api.delete(
        `/posts/${postId}/like`
    );
};

/**
 * Get post likes
 */
export const getPostLikes = async (postId) => {
    const response = await api.get(
        `/posts/${postId}/likes`
    );

    return response.data;
};

