import { useEffect, useState } from "react";

import PostCard from "./PostCard";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

import { getPosts } from "../../api/postsApi";

import "./PostList.css";

export default function PostList({
    currentUserId,
}) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadPosts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPosts();

                if (!mounted) {
                    return;
                }

                const loadedPosts =
                    Array.isArray(data)
                        ? data
                        : data?.content || [];

                setPosts(loadedPosts);
            } catch (err) {
                if (!mounted) {
                    return;
                }

                console.error(
                    "Unable to load posts",
                    err
                );

                setError(
                    "Unable to load posts. Please try again."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadPosts();

        return () => {
            mounted = false;
        };
    }, []);

    const handleCreated = (post) => {
        if (!post) {
            return;
        }

        setPosts((currentPosts) => [
            post,
            ...currentPosts,
        ]);
    };

    if (loading) {
        return (
            <div className="post-list-loading">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="post-feed-error">
                <div className="post-feed-error-icon">
                    !
                </div>

                <div>
                    <strong>
                        Something went wrong
                    </strong>

                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!posts.length) {
        return (
            <EmptyState
                title="Your feed is empty"
                message="Be the first person to share something with the community."
            />
        );
    }

    return (
        <div className="post-feed">

            <div className="feed-section-heading">
                <h2>Latest posts</h2>

                <span>
                    {posts.length}{" "}
                    {posts.length === 1
                        ? "post"
                        : "posts"}
                </span>
            </div>

            <div className="post-list">

                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={currentUserId}
                    />
                ))}

            </div>

        </div>
    );
}