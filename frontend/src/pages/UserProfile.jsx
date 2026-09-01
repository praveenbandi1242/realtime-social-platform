import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Users,
    UserPlus,
    UserMinus,
    LoaderCircle,
    RefreshCw,
    MessageCircle,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import UserAvatar from "../components/users/UserAvatar";

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
} from "../api/followsApi";

import { getUserById } from "../api/userApi";

import { useAuth } from "../context/AuthContext";

import {
    createConversation,
} from "../api/conversationApi";


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


const getFullName = (user) => {
    const fullName =
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

    return fullName || user?.username || "User";
};


const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const { user: currentUser } = useAuth();

    const [user, setUser] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const [isFollowing, setIsFollowing] = useState(false);

    const [loading, setLoading] = useState(true);
    const [connectionsLoading, setConnectionsLoading] =
        useState(true);
    const [followLoading, setFollowLoading] =
        useState(false);
    const [messageLoading, setMessageLoading] =
        useState(false);

    const [profileError, setProfileError] = useState("");
    const [connectionsError, setConnectionsError] =
        useState("");


    const loadProfile = async () => {
        if (!userId) {
            return;
        }

        try {
            setLoading(true);
            setProfileError("");

            const profile = await getUserById(userId);

            setUser(profile);
        } catch (error) {
            console.error(
                "Unable to load user profile:",
                error
            );

            setUser(null);

            setProfileError(
                "Unable to load this profile."
            );
        } finally {
            setLoading(false);
        }
    };


    const loadConnections = async () => {
        if (!userId) {
            return;
        }

        try {
            setConnectionsLoading(true);
            setConnectionsError("");

            const [
                followersResult,
                followingResult,
            ] = await Promise.allSettled([
                getFollowers(userId),
                getFollowing(userId),
            ]);

            let followerList = [];
            let followingList = [];

            if (
                followersResult.status ===
                "fulfilled"
            ) {
                followerList =
                    getUsersFromResponse(
                        followersResult.value
                    );
            } else {
                console.error(
                    "Unable to load followers:",
                    followersResult.reason
                );
            }

            if (
                followingResult.status ===
                "fulfilled"
            ) {
                followingList =
                    getUsersFromResponse(
                        followingResult.value
                    );
            } else {
                console.error(
                    "Unable to load following:",
                    followingResult.reason
                );
            }

            setFollowers(followerList);
            setFollowing(followingList);

            setIsFollowing(
                followerList.some(
                    (item) =>
                        String(item.id) ===
                        String(currentUser?.id)
                )
            );

            if (
                followersResult.status ===
                    "rejected" ||
                followingResult.status ===
                    "rejected"
            ) {
                setConnectionsError(
                    "Some connection information could not be loaded."
                );
            }
        } catch (error) {
            console.error(
                "Unable to load connections:",
                error
            );

            setConnectionsError(
                "Unable to load connection information."
            );
        } finally {
            setConnectionsLoading(false);
        }
    };


    useEffect(() => {
        loadProfile();
        loadConnections();
    }, [userId, currentUser?.id]);


    const handleFollow = async () => {
        if (
            !userId ||
            followLoading ||
            !currentUser?.id
        ) {
            return;
        }

        const previousFollowing = isFollowing;

        try {
            setFollowLoading(true);
            setConnectionsError("");

            if (previousFollowing) {
                await unfollowUser(userId);

                setIsFollowing(false);

                setFollowers((current) =>
                    current.filter(
                        (item) =>
                            String(item.id) !==
                            String(currentUser.id)
                    )
                );
            } else {
                await followUser(userId);

                setIsFollowing(true);

                setFollowers((current) => {
                    const alreadyExists =
                        current.some(
                            (item) =>
                                String(item.id) ===
                                String(currentUser.id)
                        );

                    if (alreadyExists) {
                        return current;
                    }

                    return [
                        ...current,
                        {
                            ...currentUser,
                            following: true,
                        },
                    ];
                });
            }
        } catch (error) {
            console.error(
                "Unable to update follow status:",
                error
            );

            setIsFollowing(previousFollowing);

            setConnectionsError(
                previousFollowing
                    ? "Unable to unfollow this user."
                    : "Unable to follow this user."
            );
        } finally {
            setFollowLoading(false);
        }
    };


    /*
     * Start a conversation with this user.
     *
     * The backend is responsible for:
     * - Creating the conversation if it does not exist.
     * - Returning the existing conversation if one
     *   already exists.
     *
     * After receiving the conversation, navigate directly
     * to the messages page for that conversation.
     */
    const handleMessage = async (targetUserId) => {
        if (
            !targetUserId ||
            messageLoading ||
            !currentUser?.id
        ) {
            return;
        }

        try {
            setMessageLoading(true);

            const conversation =
                await createConversation(
                    targetUserId
                );

            navigate(
                `/messages?conversation=${conversation.id}`
            );
        } catch (error) {
            console.error(
                "Unable to start conversation:",
                error
            );
        } finally {
            setMessageLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="page-content">
                <div className="content-container">
                    <div className="profile-loading-state">
                        <LoaderCircle
                            size={28}
                            className="spin"
                        />

                        <span>
                            Loading profile...
                        </span>
                    </div>
                </div>
            </div>
        );
    }


    if (profileError || !user) {
        return (
            <div className="page-content">
                <div className="content-container">
                    <div className="profile-error-card card">

                        <div className="profile-error-icon">
                            <Users size={22} />
                        </div>

                        <div>
                            <h2>
                                Profile unavailable
                            </h2>

                            <p>
                                {profileError ||
                                    "This user could not be found."}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            <ArrowLeft size={16} />
                            Go back
                        </button>

                    </div>
                </div>
            </div>
        );
    }


    const isOwnProfile =
        String(currentUser?.id) ===
        String(user.id);

    const fullName = getFullName(user);


    return (
        <div className="page-content">

            <div className="content-container user-profile-page">

                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={17} />
                    <span>Back</span>
                </button>


                <section className="card user-profile-hero">

                    <div className="user-profile-main">

                        <UserAvatar
                            user={user}
                            size="xlarge"
                        />

                        <div className="user-profile-info">

                            <h1>
                                {fullName}
                            </h1>

                            <span className="user-profile-username">
                                @{user.username}
                            </span>

                            {user.email && (
                                <span className="user-profile-email">
                                    {user.email}
                                </span>
                            )}

                            {user.bio && (
                                <p className="user-profile-bio">
                                    {user.bio}
                                </p>
                            )}

                        </div>

                    </div>


                    {!isOwnProfile && (
                        <div className="profile-action-buttons">

                            {/* MESSAGE BUTTON */}
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    handleMessage(user.id)
                                }
                                disabled={
                                    messageLoading ||
                                    followLoading
                                }
                            >
                                {messageLoading ? (
                                    <>
                                        <LoaderCircle
                                            size={15}
                                            className="spin"
                                        />

                                        Opening...
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle
                                            size={16}
                                        />

                                        Message
                                    </>
                                )}
                            </button>


                            {/* FOLLOW / UNFOLLOW BUTTON */}
                            <button
                                type="button"
                                className={
                                    isFollowing
                                        ? "btn btn-secondary profile-follow-button"
                                        : "btn btn-primary profile-follow-button"
                                }
                                onClick={handleFollow}
                                disabled={
                                    followLoading ||
                                    messageLoading
                                }
                            >
                                {followLoading ? (
                                    <>
                                        <LoaderCircle
                                            size={15}
                                            className="spin"
                                        />

                                        Updating...
                                    </>
                                ) : isFollowing ? (
                                    <>
                                        <UserMinus
                                            size={15}
                                        />

                                        Unfollow
                                    </>
                                ) : (
                                    <>
                                        <UserPlus
                                            size={15}
                                        />

                                        Follow
                                    </>
                                )}
                            </button>

                        </div>
                    )}

                </section>


                <section className="profile-stats card">

                    <button
                        type="button"
                        className="profile-stat"
                        onClick={() =>
                            document
                                .getElementById(
                                    "profile-followers"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                })
                        }
                    >
                        <strong>
                            {connectionsLoading
                                ? "—"
                                : followers.length}
                        </strong>

                        <span>
                            Followers
                        </span>
                    </button>


                    <div className="profile-stat-divider" />


                    <button
                        type="button"
                        className="profile-stat"
                        onClick={() =>
                            document
                                .getElementById(
                                    "profile-following"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                })
                        }
                    >
                        <strong>
                            {connectionsLoading
                                ? "—"
                                : following.length}
                        </strong>

                        <span>
                            Following
                        </span>
                    </button>

                </section>


                {connectionsError && (
                    <div className="profile-alert profile-alert-error">

                        <div className="profile-alert-message">
                            <strong>
                                Connection information
                            </strong>

                            <span>
                                {connectionsError}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={loadConnections}
                            disabled={
                                connectionsLoading
                            }
                        >
                            <RefreshCw
                                size={15}
                                className={
                                    connectionsLoading
                                        ? "spin"
                                        : ""
                                }
                            />

                            Retry
                        </button>

                    </div>
                )}


                <section className="social-lists">

                    <UserListCard
                        id="profile-followers"
                        title="Followers"
                        subtitle="People who follow this account"
                        icon={
                            <Users size={18} />
                        }
                        users={followers}
                        emptyMessage="No followers yet."
                        loading={connectionsLoading}
                    />


                    <UserListCard
                        id="profile-following"
                        title="Following"
                        subtitle="People this account follows"
                        icon={
                            <UserPlus size={18} />
                        }
                        users={following}
                        emptyMessage="Not following anyone yet."
                        loading={connectionsLoading}
                    />

                </section>

            </div>

        </div>
    );
};


const UserListCard = ({
    id,
    title,
    subtitle,
    icon,
    users,
    emptyMessage,
    loading,
}) => {
    const navigate = useNavigate();

    return (
        <section
            id={id}
            className="card social-list-card"
        >

            <div className="social-list-header">

                <div className="social-list-heading">

                    <div className="social-list-icon">
                        {icon}
                    </div>

                    <div>
                        <h2>
                            {title}
                        </h2>

                        <p>
                            {subtitle}
                        </p>
                    </div>

                </div>

                <span className="social-list-count">
                    {loading ? "—" : users.length}
                </span>

            </div>


            {loading ? (
                <div className="social-list-loading">

                    <LoaderCircle
                        size={22}
                        className="spin"
                    />

                    <span>
                        Loading {title.toLowerCase()}...
                    </span>

                </div>
            ) : !users.length ? (
                <div className="social-list-empty">

                    <div className="social-list-empty-icon">
                        {icon}
                    </div>

                    <strong>
                        {emptyMessage}
                    </strong>

                    <span>
                        Connection activity will
                        appear here.
                    </span>

                </div>
            ) : (
                <div className="social-user-list">

                    {users.map((item) => {
                        const name =
                            getFullName(item);

                        return (
                            <button
                                type="button"
                                key={item.id}
                                className="social-user"
                                onClick={() =>
                                    navigate(
                                        `/users/${item.id}`
                                    )
                                }
                            >

                                <UserAvatar
                                    user={item}
                                    size="medium"
                                />

                                <span className="social-user-details">

                                    <strong>
                                        {name}
                                    </strong>

                                    <small>
                                        @{item.username}
                                    </small>

                                </span>

                                <span className="social-user-arrow">
                                    →
                                </span>

                            </button>
                        );
                    })}

                </div>
            )}

        </section>
    );
};


export default UserProfile;

