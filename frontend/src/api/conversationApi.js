import api from "./axios";

export const getConversations = async () => {
    const response = await api.get(
        "/conversations"
    );

    return response.data;
};


export const createConversation = async (
    participantId
) => {

    const response = await api.post(
        "/conversations",
        {
            participantId,
        }
    );

    return response.data;
};


export const getConversation = async (
    conversationId
) => {

    const response = await api.get(
        `/conversations/${conversationId}`
    );

    return response.data;
};