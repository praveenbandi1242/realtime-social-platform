import {
    useState,
} from "react";

import {
    UserPlus,
    UserCheck,
    LoaderCircle,
    ChevronRight,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import UserAvatar from "./UserAvatar";

import {
    followUser,
    unfollowUser,
} from "../../api/followsApi";


const getFullName = (user) => {
    const name =
        `${user?.firstName || ""} ${
            user?.lastName || ""
        }`.trim();

    return name || user?.username || "User";
};


const FollowList = ({
    users = [],
    emptyMessage,
    onFollowChanged,
}) => {
    const navigate = useNavigate();

    const [processingId, setProcessingId] =
        useState(null);

    const [
        followingState,
        setFollowingState,
    ] = useState({});


    const isUserFollowing = (
        targetUser
    ) => {
        if (
            Object.prototype.hasOwnProperty.call(
                followingState,
                targetUser.id
            )
        ) {
            return followingState[
                targetUser.id
            ];
        }

        return Boolean(
            targetUser.following
        );
    };


    const handleFollow = async (
        event,
        targetUser
    ) => {
        event.stopPropagation();

        if (
            processingId ===
            targetUser.id
        ) {
            return;
        }

        const currentlyFollowing =
            isUserFollowing(targetUser);

        try {
            setProcessingId(
                targetUser.id
            );

            if (currentlyFollowing) {
                await unfollowUser(
                    targetUser.id
                );
            } else {
                await followUser(
                    targetUser.id
                );
            }

            setFollowingState(
                (current) => ({
                    ...current,

                    [targetUser.id]:
                        !currentlyFollowing,
                })
            );

            await onFollowChanged?.(
                targetUser.id
            );
        } catch (error) {
            console.error(
                "Unable to update follow:",
                error
            );
        } finally {
            setProcessingId(null);
        }
    };


    if (users.length === 0) {
        return (
            <div className="follow-empty">

                <div className="follow-empty-icon">
                    <UserPlus size={22} />
                </div>

                <strong>
                    {emptyMessage}
                </strong>

                <p>
                    When you connect with people,
                    they will appear here.
                </p>

            </div>
        );
    }


    return (
        <div className="follow-list">

            {users.map((item) => {
                const name =
                    getFullName(item);

                const following =
                    isUserFollowing(item);

                const processing =
                    processingId === item.id;


                return (
                    <div
                        className="follow-user"
                        key={item.id}
                    >

                        <button
                            type="button"
                            className="follow-user-profile"
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

                            <div className="follow-user-info">

                                <strong>
                                    {name}
                                </strong>

                                <span>
                                    @{item.username}
                                </span>

                                {item.bio && (
                                    <small>
                                        {item.bio}
                                    </small>
                                )}

                            </div>

                            <ChevronRight
                                size={18}
                                className="follow-user-chevron"
                            />

                        </button>


                        <button
                            type="button"
                            className={
                                following
                                    ? "btn btn-secondary follow-action-button"
                                    : "btn btn-primary follow-action-button"
                            }
                            disabled={processing}
                            onClick={(event) =>
                                handleFollow(
                                    event,
                                    item
                                )
                            }
                        >

                            {processing ? (
                                <>
                                    <LoaderCircle
                                        size={15}
                                        className="spin"
                                    />

                                    <span>
                                        Updating
                                    </span>
                                </>
                            ) : following ? (
                                <>
                                    <UserCheck
                                        size={15}
                                    />

                                    <span>
                                        Following
                                    </span>
                                </>
                            ) : (
                                <>
                                    <UserPlus
                                        size={15}
                                    />

                                    <span>
                                        Follow
                                    </span>
                                </>
                            )}

                        </button>

                    </div>
                );
            })}

        </div>
    );
};


export default FollowList;