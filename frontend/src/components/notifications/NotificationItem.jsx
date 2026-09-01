import {
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    Check,
} from "lucide-react";

const getNotificationIcon = (type) => {
    switch (type) {
        case "FOLLOW":
            return <UserPlus size={18} strokeWidth={2} />;

        case "LIKE":
            return <Heart size={18} strokeWidth={2} />;

        case "COMMENT":
            return (
                <MessageCircle
                    size={18}
                    strokeWidth={2}
                />
            );

        default:
            return <Bell size={18} strokeWidth={2} />;
    }
};

const formatNotificationTime = (
    createdAt
) => {
    if (!createdAt) {
        return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const formatRelativeTime = (
    createdAt
) => {
    if (!createdAt) {
        return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const now = new Date();

    const difference =
        now.getTime() -
        date.getTime();

    const seconds = Math.floor(
        difference / 1000
    );

    if (seconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(
        seconds / 60
    );

    if (minutes < 60) {
        return `${minutes} ${
            minutes === 1
                ? "minute"
                : "minutes"
        } ago`;
    }

    const hours = Math.floor(
        minutes / 60
    );

    if (hours < 24) {
        return `${hours} ${
            hours === 1
                ? "hour"
                : "hours"
        } ago`;
    }

    const days = Math.floor(
        hours / 24
    );

    if (days < 7) {
        return `${days} ${
            days === 1
                ? "day"
                : "days"
        } ago`;
    }

    return date.toLocaleDateString(
        [],
        {
            dateStyle: "medium",
        }
    );
};

const NotificationItem = ({
    notification,
    onRead,
}) => {
    const isUnread =
        !notification.read;

    const handleRead = () => {
        if (isUnread) {
            onRead(notification);
        }
    };

    const fullTime =
        formatNotificationTime(
            notification.createdAt
        );

    const relativeTime =
        formatRelativeTime(
            notification.createdAt
        );

    return (
        <article
            className={`notification-item ${
                isUnread
                    ? "unread"
                    : "read"
            }`}
        >
            <button
                type="button"
                className="notification-main"
                onClick={handleRead}
                aria-label={
                    isUnread
                        ? `Mark notification as read: ${notification.message}`
                        : notification.message
                }
            >
                <div
                    className="notification-icon"
                    aria-hidden="true"
                >
                    {getNotificationIcon(
                        notification.type
                    )}
                </div>

                <div className="notification-body">
                    <p>
                        {notification.message}
                    </p>

                    <time
                        dateTime={
                            notification.createdAt
                        }
                        title={fullTime}
                    >
                        {relativeTime}
                    </time>
                </div>

                {isUnread && (
                    <span
                        className="notification-unread"
                        aria-label="Unread notification"
                    />
                )}
            </button>

            {isUnread && (
                <button
                    type="button"
                    className="notification-read-button"
                    onClick={() =>
                        onRead(notification)
                    }
                    aria-label="Mark as read"
                    title="Mark as read"
                >
                    <Check
                        size={15}
                        strokeWidth={2.2}
                    />
                </button>
            )}
        </article>
    );
};

export default NotificationItem;