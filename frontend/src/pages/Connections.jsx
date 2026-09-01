import {
    useEffect,
    useState,
} from "react";

import {
    Users,
    UserRoundCheck,
} from "lucide-react";

import {
    getFollowers,
    getFollowing,
} from "../api/followsApi";

import {
    useAuth,
} from "../context/AuthContext";

import FollowList from "../components/users/FollowList";

import Loader from "../components/common/Loader";


const getUsersFromResponse = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    if (Array.isArray(data?.users)) {
        return data.users;
    }

    return [];
};


const ConnectionsPage = () => {
    const { user } = useAuth();

    const [activeTab, setActiveTab] =
        useState("followers");

    const [followers, setFollowers] =
        useState([]);

    const [following, setFollowing] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadConnections = async () => {
        if (!user?.id) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [
                followersData,
                followingData,
            ] = await Promise.all([
                getFollowers(user.id),
                getFollowing(user.id),
            ]);

            setFollowers(
                getUsersFromResponse(
                    followersData
                )
            );

            setFollowing(
                getUsersFromResponse(
                    followingData
                )
            );
        } catch (error) {
            console.error(
                "Unable to load connections:",
                error
            );

            setError(
                "Unable to load your connections. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (user?.id) {
            loadConnections();
        }
    }, [user?.id]);


    const handleChanged = async () => {
        await loadConnections();
    };


    if (loading) {
        return (
            <div className="page-content">

                <div className="content-container">

                    <div className="connections-loading-page">

                        <Loader />

                        <p>
                            Loading your connections...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    const users =
        activeTab === "followers"
            ? followers
            : following;


    return (
        <div className="page-content">

            <div className="content-container connections-page">

                <header className="page-header connections-page-header">

                    <div className="page-header-icon">
                        <Users size={21} />
                    </div>

                    <div>
                        <h1>
                            Your connections
                        </h1>

                        <p>
                            Manage the people you follow
                            and the people following you.
                        </p>
                    </div>

                </header>


                {error && (
                    <div className="connections-error">

                        <div>
                            <strong>
                                Something went wrong
                            </strong>

                            <span>
                                {error}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={loadConnections}
                        >
                            Try again
                        </button>

                    </div>
                )}


                <section className="card connections-card">

                    <div className="connections-tabs">

                        <button
                            type="button"
                            className={
                                activeTab === "followers"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveTab(
                                    "followers"
                                )
                            }
                        >

                            <span className="connections-tab-icon">
                                <Users size={17} />
                            </span>

                            <span className="connections-tab-content">

                                <strong>
                                    Followers
                                </strong>

                                <small>
                                    People following you
                                </small>

                            </span>

                            <span className="connections-tab-count">
                                {followers.length}
                            </span>

                        </button>


                        <button
                            type="button"
                            className={
                                activeTab === "following"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveTab(
                                    "following"
                                )
                            }
                        >

                            <span className="connections-tab-icon">
                                <UserRoundCheck
                                    size={17}
                                />
                            </span>

                            <span className="connections-tab-content">

                                <strong>
                                    Following
                                </strong>

                                <small>
                                    People you follow
                                </small>

                            </span>

                            <span className="connections-tab-count">
                                {following.length}
                            </span>

                        </button>

                    </div>


                    <div className="connections-list-wrapper">

                        <div className="connections-list-header">

                            <div>
                                <h2>
                                    {activeTab ===
                                    "followers"
                                        ? "Your followers"
                                        : "People you follow"}
                                </h2>

                                <p>
                                    {users.length === 1
                                        ? "1 connection"
                                        : `${users.length} connections`}
                                </p>
                            </div>

                        </div>


                        <FollowList
                            users={users}
                            emptyMessage={
                                activeTab ===
                                "followers"
                                    ? "You don't have any followers yet."
                                    : "You aren't following anyone yet."
                            }
                            onFollowChanged={
                                handleChanged
                            }
                        />

                    </div>

                </section>

            </div>

        </div>
    );
};


export default ConnectionsPage;