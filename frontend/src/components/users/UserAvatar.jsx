const UserAvatar = ({
    user,
    size = "medium",
}) => {
    const firstInitial =
        user?.firstName?.[0] || "";

    const lastInitial =
        user?.lastName?.[0] || "";

    const initials =
        `${firstInitial}${lastInitial}`
            .trim()
            .toUpperCase();

    const fallbackInitial =
        user?.username?.[0]
            ?.toUpperCase() || "U";


    const displayInitials =
        initials || fallbackInitial;


    return (
        <div
            className={`avatar avatar-${size}`}
            aria-label={
                user?.username
                    ? `Profile picture of @${user.username}`
                    : "User profile picture"
            }
        >
            {user?.profileImageUrl ? (
                <img
                    src={user.profileImageUrl}
                    alt={
                        user?.username
                            ? `@${user.username}`
                            : "User"
                    }
                    loading="lazy"
                />
            ) : (
                <span>
                    {displayInitials}
                </span>
            )}
        </div>
    );
};


export default UserAvatar;