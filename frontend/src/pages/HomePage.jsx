import {
    useEffect,
    useState,
} from "react";

import {
    Home,
    RefreshCw,
} from "lucide-react";

import CreatePost from "../components/posts/CreatePost";
import PostCard from "../components/posts/PostCard";

import {
    getPosts,
} from "../api/postApi";

import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

const HomePage = () => {
    const [
        posts,
        setPosts,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const loadPosts =
        async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getPosts();

                setPosts(
                    data?.content || []
                );
            } catch (err) {
                setError(
                    "Unable to load your feed."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleCreated =
        (post) => {
            setPosts(
                (current) => [
                    post,
                    ...current,
                ]
            );
        };

    const handleUpdated =
        (updatedPost) => {
            setPosts(
                (current) =>
                    current.map(
                        (post) =>
                            post.id ===
                            updatedPost.id
                                ? updatedPost
                                : post
                    )
            );
        };

    const handleDeleted =
        (postId) => {
            setPosts(
                (current) =>
                    current.filter(
                        (post) =>
                            post.id !==
                            postId
                    )
            );
        };

    return (
        <div className="page-content">

            <div className="content-container home-page">

                <header className="page-header home-header">

                    <div className="page-header-icon">
                        <Home size={21} />
                    </div>

                    <div>
                        <h1>
                            Home
                        </h1>

                        <p>
                            See what's happening
                            across your network.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-ghost refresh-button"
                        onClick={
                            loadPosts
                        }
                        disabled={
                            loading
                        }
                    >
                        <RefreshCw
                            size={16}
                        />

                        Refresh
                    </button>

                </header>

                <CreatePost
                    onCreated={
                        handleCreated
                    }
                />

                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : posts.length ===
                  0 ? (
                    <EmptyState
                        title="Your feed is empty"
                        message="Create the first post and start the conversation."
                    />
                ) : (
                    <div className="posts-feed">

                        {posts.map(
                            (post) => (
                                <PostCard
                                    key={
                                        post.id
                                    }
                                    post={
                                        post
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
                )}

            </div>

        </div>
    );
};

export default HomePage;