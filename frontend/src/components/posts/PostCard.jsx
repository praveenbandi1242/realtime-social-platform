import {
    useState,
} from "react";

import {
    Heart,
    MessageCircle,
    MoreHorizontal,
    Pencil,
    Trash2,
    X,
    Check,
} from "lucide-react";

import UserAvatar from "../users/UserAvatar";

import {
    likePost,
    unlikePost,
    updatePost,
    deletePost,
} from "../../api/postApi";

import CommentList from "../comments/CommentList";

import { useAuth } from "../../context/AuthContext";

import "./PostCard.css";

const PostCard = ({
    post,
    onUpdated,
    onDeleted,
}) => {
    const { user } = useAuth();

    const [
        liked,
        setLiked,
    ] = useState(
        post.likedByCurrentUser
    );

    const [
        likeCount,
        setLikeCount,
    ] = useState(
        post.likeCount
    );

    const [
        editing,
        setEditing,
    ] = useState(false);

    const [
        content,
        setContent,
    ] = useState(post.content);

    const [
        menuOpen,
        setMenuOpen,
    ] = useState(false);

    const [
        showComments,
        setShowComments,
    ] = useState(false);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const isOwner =
        user?.id === post.userId;

    const displayName =
        `${post.firstName || ""} ${
            post.lastName || ""
        }`.trim() ||
        post.username;

    const handleLike =
        async () => {
            const nextLiked =
                !liked;

            setLiked(nextLiked);

            setLikeCount(
                (current) =>
                    nextLiked
                        ? current + 1
                        : Math.max(
                              0,
                              current - 1
                          )
            );

            try {
                if (nextLiked) {
                    await likePost(
                        post.id
                    );
                } else {
                    await unlikePost(
                        post.id
                    );
                }
            } catch (error) {
                setLiked(liked);

                setLikeCount(
                    post.likeCount
                );
            }
        };

    const handleUpdate =
        async () => {
            if (!content.trim()) {
                return;
            }

            try {
                setSaving(true);

                const updated =
                    await updatePost(
                        post.id,
                        {
                            content:
                                content.trim(),
                        }
                    );

                onUpdated?.(updated);

                setEditing(false);
            } finally {
                setSaving(false);
            }
        };

    const handleDelete =
        async () => {
            const confirmed =
                window.confirm(
                    "Delete this post?"
                );

            if (!confirmed) {
                return;
            }

            await deletePost(
                post.id
            );

            onDeleted?.(post.id);
        };

    return (
        <article className="card post-card">

            <div className="post-header">

                <UserAvatar
                    user={{
                        username:
                            post.username,
                        firstName:
                            post.firstName,
                        lastName:
                            post.lastName,
                    }}
                    size="medium"
                />

                <div className="post-author">

                    <strong>
                        {displayName}
                    </strong>

                    <span>
                        @{post.username}
                    </span>

                    <time>
                        {new Date(
                            post.createdAt
                        ).toLocaleString()}
                    </time>

                </div>

                {isOwner && (
                    <div className="post-menu-wrapper">

                        <button
                            type="button"
                            className="icon-button"
                            onClick={() =>
                                setMenuOpen(
                                    !menuOpen
                                )
                            }
                        >
                            <MoreHorizontal
                                size={19}
                            />
                        </button>

                        {menuOpen && (
                            <div className="post-menu">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(
                                            true
                                        );
                                        setMenuOpen(
                                            false
                                        );
                                    }}
                                >
                                    <Pencil
                                        size={15}
                                    />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="danger-action"
                                    onClick={
                                        handleDelete
                                    }
                                >
                                    <Trash2
                                        size={15}
                                    />
                                    Delete
                                </button>

                            </div>
                        )}

                    </div>
                )}

            </div>

            <div className="post-body">

                {editing ? (
                    <div className="post-edit">

                        <textarea
                            value={content}
                            onChange={(event) =>
                                setContent(
                                    event.target
                                        .value
                                )
                            }
                            rows={5}
                            maxLength={2000}
                        />

                        <div className="post-edit-actions">

                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={saving}
                                onClick={
                                    handleUpdate
                                }
                            >
                                <Check
                                    size={15}
                                />

                                {saving
                                    ? "Saving..."
                                    : "Save"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => {
                                    setContent(
                                        post.content
                                    );
                                    setEditing(
                                        false
                                    );
                                }}
                            >
                                <X size={15} />
                                Cancel
                            </button>

                        </div>

                    </div>
                ) : (
                    <p>
                        {post.content}
                    </p>
                )}

            </div>

            <div className="post-stats">

                <span>
                    <Heart
                        size={15}
                        fill={
                            liked
                                ? "currentColor"
                                : "none"
                        }
                    />

                    {likeCount}
                </span>

                <span>
                    {post.commentCount} comments
                </span>

            </div>

            <div className="post-actions">

                <button
                    type="button"
                    className={
                        liked
                            ? "post-action active"
                            : "post-action"
                    }
                    onClick={
                        handleLike
                    }
                >
                    <Heart
                        size={18}
                        fill={
                            liked
                                ? "currentColor"
                                : "none"
                        }
                    />

                    Like
                </button>

                <button
                    type="button"
                    className="post-action"
                    onClick={() =>
                        setShowComments(
                            !showComments
                        )
                    }
                >
                    <MessageCircle
                        size={18}
                    />

                    Comment
                </button>

            </div>

            {showComments && (
                <CommentList
                    postId={post.id}
                />
            )}

        </article>
    );
};

export default PostCard;