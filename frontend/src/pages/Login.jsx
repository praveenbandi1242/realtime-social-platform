import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { useAuth } from "../context/AuthContext";

import "../components/ui/Input.css";
import "../components/ui/Button.css";
import "./AuthPages.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm((previous) => ({
            ...previous,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(form);

            navigate("/");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to sign in. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="auth-heading">
                <h1>Welcome back 👋</h1>

                <p>
                    Sign in to continue to your Socially account.
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
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                />

                <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                >
                    Sign in
                    {!loading && <span>→</span>}
                </Button>
            </form>

            <div className="auth-switch">
                <span>Don't have an account?</span>

                <Link to="/register">
                    Create one
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;

