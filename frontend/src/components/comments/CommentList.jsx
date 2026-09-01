import {
    useEffect,
    useState,
} from "react";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

import {
    getComments,
} from "../../api/commentsApi";

import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

const CommentList = ({
    postId,
}) => {
    const [comments, setComments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadComments = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getComments(postId);

            setComments(
                Array.isArray(data)
                    ? data
                    : data?.content || []
            );
        } catch (err) {
            setError(
                "Unable to load comments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    const handleCreated = (
        comment
    ) => {
        setComments(
            (current) => [
                ...current,
                comment,
            ]
        );
    };

    const handleUpdated = (
        updatedComment
    ) => {
        setComments(
            (current) =>
                current.map(
                    (comment) =>
                        comment.id ===
                        updatedComment.id
                            ? updatedComment
                            : comment
                )
        );
    };

    const handleDeleted = (
        commentId
    ) => {
        setComments(
            (current) =>
                current.filter(
                    (comment) =>
                        comment.id !==
                        commentId
                )
        );
    };

    return (
        <div className="comments-section">

            <div className="comments-list">

                {loading && <Loader />}

                {!loading && error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    comments.length === 0 && (
                        <EmptyState
                            title="No comments yet"
                            message="Be the first to join the conversation."
                        />
                    )}

                {!loading &&
                    comments.map(
                        (comment) => (
                            <CommentItem
                                key={
                                    comment.id
                                }
                                comment={
                                    comment
                                }
                                onUpdated={
                                    handleUpdated
                                }
                                onDeleted={
                                    handleDeleted
                                }
                            />
                        )
                    )}

            </div>

            <CommentForm
                postId={postId}
                onCreated={
                    handleCreated
                }
            />

        </div>
    );
};

export default CommentList;