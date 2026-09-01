import api from "./axios";


export const getMessages = async (
    conversationId,
    page = 0,
    size = 50
) => {

    const response =
        await api.get(
            `/conversations/${conversationId}/messages`,
            {
                params: {
                    page,
                    size,
                },
            }
        );

    return response.data;
};


export const sendMessage = async (
    conversationId,
    content
) => {

    const response =
        await api.post(
            `/conversations/${conversationId}/messages`,
            {
                content,
            }
        );

    return response.data;
};