import api from "./axios";

export const getNotifications = async (
    page = 0,
    size = 20
) => {
    const response = await api.get(
        "/notifications",
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};

export const getUnreadCount = async () => {
    const response = await api.get(
        "/notifications/unread-count"
    );

    return response.data;
};

export const markNotificationAsRead = async (
    notificationId
) => {
    await api.patch(
        `/notifications/${notificationId}/read`
    );
};

