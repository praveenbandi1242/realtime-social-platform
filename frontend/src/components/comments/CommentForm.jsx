import { useState } from "react";

import Button from "../common/Button";
import { createComment } from "../../api/commentsApi";

export default function CommentForm({
    postId,
    onCreated,
}) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            setLoading(true);

            const comment = await createComment(
                postId,
                {
                    content: content.trim(),
                }
            );

            setContent("");

            onCreated?.(comment);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="comment-form"
            onSubmit={handleSubmit}
        >
            <input
                value={content}
                onChange={(event) =>
                    setContent(event.target.value)
                }
                placeholder="Write a comment..."
                maxLength={500}
            />

            <Button
                type="submit"
                loading={loading}
                disabled={!content.trim()}
            >
                Send
            </Button>
        </form>
    );
}