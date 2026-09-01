import { useState } from "react";
import {
    Image,
    Send,
} from "lucide-react";

import {
    createPost,
} from "../../api/postApi";

import UserAvatar from "../users/UserAvatar";

import { useAuth } from "../../context/AuthContext";

import "./CreatePost.css";

const CreatePost = ({
    onCreated,
}) => {
    const { user } = useAuth();

    const [content, setContent] =
        useState("");

    const [posting, setPosting] =
        useState(false);

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            if (!content.trim()) {
                return;
            }

            try {
                setPosting(true);

                const post =
                    await createPost({
                        content:
                            content.trim(),
                    });

                setContent("");

                onCreated?.(post);
            } finally {
                setPosting(false);
            }
        };

    return (
        <section className="card create-post">

            <div className="create-post-header">

                <UserAvatar
                    user={user}
                    size="medium"
                />

                <div>
                    <strong>
                        {user?.firstName ||
                            user?.username}
                    </strong>

                    <span>
                        Share something with
                        your network
                    </span>
                </div>

            </div>

            <form
                className="create-post-form"
                onSubmit={handleSubmit}
            >

                <textarea
                    value={content}
                    onChange={(event) =>
                        setContent(
                            event.target.value
                        )
                    }
                    placeholder="What's on your mind?"
                    maxLength={2000}
                    rows={4}
                    disabled={posting}
                />

                <div className="create-post-footer">

                    <button
                        type="button"
                        className="post-tool"
                        disabled={posting}
                    >
                        <Image size={17} />
                        Media
                    </button>

                    <div className="post-character-count">
                        {content.length}/2000
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                            posting ||
                            !content.trim()
                        }
                    >
                        <Send size={16} />

                        {posting
                            ? "Posting..."
                            : "Post"}
                    </button>

                </div>

            </form>

        </section>
    );
};

export default CreatePost;