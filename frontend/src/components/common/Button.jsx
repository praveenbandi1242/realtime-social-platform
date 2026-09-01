export default function Button({
    children,
    type = "button",
    variant = "primary",
    loading = false,
    disabled = false,
    onClick,
}) {
    const classes = {
        primary: "btn btn-primary",
        secondary: "btn btn-secondary",
        danger: "btn btn-danger",
        ghost: "btn btn-ghost",
    };

    return (
        <button
            type={type}
            className={classes[variant]}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}