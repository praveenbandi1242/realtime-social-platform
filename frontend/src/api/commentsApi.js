import api from "./axios";

export const getComments = async (
    postId,
    page = 0,
    size = 20
) => {
    const response = await api.get(
        `/posts/${postId}/comments`,
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};

export const createComment = async (
    postId,
    data
) => {
    const response = await api.post(
        `/posts/${postId}/comments`,
        data
    );

    return response.data;
};

export const updateComment = async (
    commentId,
    data
) => {
    const response = await api.put(
        `/comments/${commentId}`,
        data
    );

    return response.data;
};

export const deleteComment = async (
    commentId
) => {
    await api.delete(
        `/comments/${commentId}`
    );
};