import UserAvatar from "../users/UserAvatar";

export default function CommentItem({ comment }) {
    return (
        <div className="comment-item">
            <UserAvatar
                user={comment.user}
                size="small"
            />

            <div className="comment-content">
                <div className="comment-author">
                    {comment.user?.firstName}{" "}
                    {comment.user?.lastName}
                </div>

                <p>{comment.content}</p>
            </div>
        </div>
    );
}