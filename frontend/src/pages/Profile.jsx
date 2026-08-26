import { useState } from "react";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/userApi";

const Profile = () => {

    const { user } = useAuth();

    const [form, setForm] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio || "",
        profileImageUrl:
            user.profileImageUrl || ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (event) => {

        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            await updateProfile(form);

            setMessage(
                "Profile updated successfully."
            );

        } catch {

            setMessage(
                "Failed to update profile."
            );
        }
    };

    return (
        <>
            <Navbar />

            <main className="page">

                <section className="profile-card">

                    <h1>Your Profile</h1>

                    <p>
                        @{user.username}
                    </p>

                    {message && (
                        <div className="message">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="First name"
                        />

                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Last name"
                        />

                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Bio"
                        />

                        <input
                            name="profileImageUrl"
                            value={form.profileImageUrl}
                            onChange={handleChange}
                            placeholder="Profile image URL"
                        />

                        <button type="submit">
                            Save changes
                        </button>

                    </form>

                </section>

            </main>
        </>
    );
};

export default Profile;