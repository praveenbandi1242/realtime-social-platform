export default function Input({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
}) {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}