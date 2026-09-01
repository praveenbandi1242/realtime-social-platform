const Button = ({
    children,
    type = "button",
    variant = "primary",
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
}) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`ui-button ui-button-${variant} ${
                fullWidth ? "ui-button-full" : ""
            }`}
        >
            {loading ? (
                <span className="button-loader" />
            ) : (
                children
            )}
        </button>
    );
};

export default Button;