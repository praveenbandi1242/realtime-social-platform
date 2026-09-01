const Input = ({
    label,
    error,
    ...props
}) => {
    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                </label>
            )}

            <input
                className={`ui-input ${
                    error ? "ui-input-error" : ""
                }`}
                {...props}
            />

            {error && (
                <span className="input-error">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;