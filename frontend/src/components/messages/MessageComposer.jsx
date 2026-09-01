import {
    Send,
    LoaderCircle,
} from "lucide-react";

import {
    useState,
} from "react";


const MessageComposer = ({
    onSend,
    sending = false,
    disabled = false,
}) => {

    const [content, setContent] =
        useState("");


    const submit = async () => {

        const trimmed =
            content.trim();


        if (
            !trimmed ||
            disabled ||
            sending
        ) {
            return;
        }


        try {

            await onSend(trimmed);

            setContent("");

        } catch (error) {

            console.error(
                "Message send failed:",
                error
            );
        }
    };


    const handleKeyDown = async (
        event
    ) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            await submit();
        }
    };


    return (

        <div className="message-composer">

            <textarea
                value={content}
                onChange={(event) =>
                    setContent(
                        event.target.value
                    )
                }
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                maxLength={2000}
                disabled={
                    disabled ||
                    sending
                }
                rows={1}
                aria-label="Message"
            />


            <button
                type="button"
                className="message-send-button"
                onClick={submit}
                disabled={
                    disabled ||
                    sending ||
                    !content.trim()
                }
                aria-label="Send message"
            >

                {sending ? (

                    <LoaderCircle
                        size={17}
                        className="spin"
                    />

                ) : (

                    <Send
                        size={17}
                    />

                )}

            </button>

        </div>
    );
};


export default MessageComposer;