import { Check } from "lucide-react";

import { useAuth } from "../../context/AuthContext";


const formatMessageTime = (timestamp) => {

    if (!timestamp) {
        return "";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit",
        }
    ).format(new Date(timestamp));
};


const MessageBubble = ({
    message,
}) => {

    const { user: currentUser } =
        useAuth();

    const isOwnMessage =
        String(message.senderId) ===
        String(currentUser?.id);


    return (
        <div
            className={
                isOwnMessage
                    ? "message-row own"
                    : "message-row"
            }
        >

            <div
                className={
                    isOwnMessage
                        ? "message-bubble own"
                        : "message-bubble"
                }
            >

                <p className="message-content">
                    {message.content}
                </p>

                <div className="message-meta">

                    <time>
                        {formatMessageTime(
                            message.createdAt
                        )}
                    </time>

                    {isOwnMessage && (
                        <Check
                            size={13}
                            aria-label="Sent"
                        />
                    )}

                </div>

            </div>

        </div>
    );
};


export default MessageBubble;