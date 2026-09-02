import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import "../components/ui/Input.css";
import "../components/ui/Button.css";
import "./AuthPages.css";

import { register } from "../api/authApi";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await register(form);

            navigate("/login");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to create your account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="auth-heading">
                <h1>Create your account ✨</h1>

                <p>
                    Join Socially and start connecting with people.
                </p>
            </div>

            {error && (
                <div className="auth-error">
                    <span>!</span>
                    <span>{error}</span>
                </div>
            )}

            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >
                <Input
                    label="Username"
                    name="username"
                    placeholder="praveen123"
                    value={form.username}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <div className="auth-name-grid">
                    <Input
                        label="First name"
                        name="firstName"
                        placeholder="Praveen"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Last name"
                        name="lastName"
                        placeholder="Bandi"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />

                <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                >
                    Create account
                    {!loading && <span>→</span>}
                </Button>
            </form>

            <div className="auth-switch">
                <span>Already have an account?</span>

                <Link to="/login">
                    Sign in
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Register;