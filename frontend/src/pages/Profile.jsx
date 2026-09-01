import { useEffect, useState } from "react";
import {
    UserRound,
    Mail,
    AtSign,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/userApi";
import UserAvatar from "../components/users/UserAvatar";

const Profile = () => {
    const { user } = useAuth();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        profileImageUrl: "",
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            return;
        }

        setForm({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            bio: user.bio || "",
            profileImageUrl: user.profileImageUrl || "",
        });
    }, [user]);

    if (!user) {
        return (
            <div className="page-content">
                <div className="content-container">
                    <div className="loader-wrapper">
                        <div className="loader" />
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setMessage("");
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            await updateProfile(form);

            setMessage("Your profile has been updated successfully.");
        } catch (err) {
            console.error("Unable to update profile:", err);

            setError(
                "We couldn't update your profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const displayName =
        form.firstName || form.lastName
            ? `${form.firstName} ${form.lastName}`.trim()
            : user.username;

    return (
        <div className="page-content">
            <div className="content-container profile-page">

                {/* Page header */}
                <header className="page-header">
                    <div className="page-header-icon">
                        <UserRound size={21} />
                    </div>

                    <div>
                        <h1>Your profile</h1>

                        <p>
                            Manage your personal information and profile.
                        </p>
                    </div>
                </header>

                {/* Profile overview */}
                <section className="card profile-identity">
                    <div className="profile-identity-main">

                        <UserAvatar
                            user={{
                                ...user,
                                ...form,
                            }}
                            size="xlarge"
                        />

                        <div className="profile-identity-info">
                            <h2>{displayName}</h2>

                            <div className="profile-username">
                                <AtSign size={15} />
                                <span>{user.username}</span>
                            </div>

                            <div className="profile-email">
                                <Mail size={15} />
                                <span>{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-status">
                        <span className="status-dot" />
                        <span>
                            {user.enabled ? "Active account" : "Disabled account"}
                        </span>
                    </div>
                </section>

                {/* Personal information */}
                <section className="card profile-form-card">

                    <div className="section-heading">
                        <div>
                            <h2>Personal information</h2>

                            <p>
                                Update the information shown on your profile.
                            </p>
                        </div>
                    </div>

                    {message && (
                        <div className="profile-alert profile-alert-success">
                            <CheckCircle2 size={18} />

                            <span>{message}</span>
                        </div>
                    )}

                    {error && (
                        <div className="profile-alert profile-alert-error">
                            <AlertCircle size={18} />

                            <span>{error}</span>
                        </div>
                    )}

                    <form
                        className="profile-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="profile-form-grid">

                            <div className="form-group">
                                <label htmlFor="firstName">
                                    First name
                                </label>

                                <div className="input-with-icon">
                                    <UserRound size={17} />

                                    <input
                                        id="firstName"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="Your first name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">
                                    Last name
                                </label>

                                <div className="input-with-icon">
                                    <UserRound size={17} />

                                    <input
                                        id="lastName"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        placeholder="Your last name"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="form-group">
                            <label htmlFor="bio">
                                Bio
                            </label>

                            <textarea
                                id="bio"
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Tell people a little about yourself..."
                                rows={5}
                                maxLength={250}
                            />

                            <div className="field-hint">
                                <span>
                                    A short description about you.
                                </span>

                                <span>
                                    {form.bio.length}/250
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="profileImageUrl">
                                Profile image URL
                            </label>

                            <div className="input-with-icon">
                                <ImageIcon size={17} />

                                <input
                                    id="profileImageUrl"
                                    name="profileImageUrl"
                                    value={form.profileImageUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/profile.jpg"
                                />
                            </div>

                            <span className="field-description">
                                Add a publicly accessible image URL for
                                your profile picture.
                            </span>
                        </div>

                        <div className="profile-form-footer">

                            <div className="profile-footer-info">
                                <strong>
                                    Keep your profile up to date
                                </strong>

                                <span>
                                    Your changes will be visible across
                                    CConnect.
                                </span>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary profile-save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save changes"}
                            </button>

                        </div>

                    </form>
                </section>

                {/* Account information */}
                <section className="card account-info-card">

                    <div className="section-heading">
                        <div>
                            <h2>Account information</h2>

                            <p>
                                Basic information associated with your account.
                            </p>
                        </div>
                    </div>

                    <div className="account-info-list">

                        <div className="account-info-item">
                            <span className="account-info-label">
                                Username
                            </span>

                            <span className="account-info-value">
                                @{user.username}
                            </span>
                        </div>

                        <div className="account-info-item">
                            <span className="account-info-label">
                                Email
                            </span>

                            <span className="account-info-value">
                                {user.email}
                            </span>
                        </div>

                        <div className="account-info-item">
                            <span className="account-info-label">
                                Account status
                            </span>

                            <span className="account-status">
                                <span className="status-dot" />

                                {user.enabled
                                    ? "Active"
                                    : "Disabled"}
                            </span>
                        </div>

                    </div>

                </section>

            </div>
        </div>
    );
};

export default Profile;