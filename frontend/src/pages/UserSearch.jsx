import { useState } from "react";
import { Search, UserRound, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { searchUsers } from "../api/userApi";
import UserAvatar from "../components/users/UserAvatar";

const UserSearch = () => {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (event) => {
        event.preventDefault();

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setUsers([]);
            setSearched(false);
            setError("");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSearched(true);

            const result = await searchUsers(trimmedQuery);

            setUsers(result?.content || []);
        } catch (err) {
            setUsers([]);
            setError("Unable to search users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuery("");
        setUsers([]);
        setSearched(false);
        setError("");
    };

    const handleUserClick = (userId) => {
        navigate(`/users/${userId}`);
    };

    return (
        <div className="page-content">
            <div className="content-container search-page">

                {/* Header */}
                <header className="page-header search-page-header">
                    <div className="page-header-icon">
                        <Search size={21} strokeWidth={2} />
                    </div>

                    <div>
                        <h1>Find people</h1>

                        <p>
                            Discover people and connect with your community.
                        </p>
                    </div>
                </header>

                {/* Search card */}
                <section className="card search-panel">

                    <form
                        className="search-form"
                        onSubmit={handleSearch}
                    >
                        <div className="search-input-wrapper">

                            <Search
                                className="search-input-icon"
                                size={19}
                            />

                            <input
                                type="text"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Search by name or username..."
                                aria-label="Search users"
                            />

                            {query && (
                                <button
                                    type="button"
                                    className="search-clear"
                                    onClick={handleClear}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary search-button"
                            disabled={loading || !query.trim()}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>

                </section>

                {/* Loading */}
                {loading && (
                    <section className="search-results-section">

                        <div className="results-heading">
                            <div>
                                <h2>People</h2>
                                <span>Searching for users...</span>
                            </div>
                        </div>

                        <div className="user-results">
                            {[1, 2, 3].map((item) => (
                                <div
                                    className="user-result-card skeleton-card"
                                    key={item}
                                >
                                    <div className="skeleton skeleton-avatar" />

                                    <div className="skeleton-user-info">
                                        <div className="skeleton skeleton-name" />
                                        <div className="skeleton skeleton-username" />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </section>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="search-error">
                        <div className="search-error-icon">
                            !
                        </div>

                        <div>
                            <strong>Something went wrong</strong>

                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Search results */}
                {!loading &&
                    !error &&
                    searched &&
                    users.length > 0 && (
                        <section className="search-results-section">

                            <div className="results-heading">
                                <div>
                                    <h2>People</h2>

                                    <span>
                                        {users.length}{" "}
                                        {users.length === 1
                                            ? "person"
                                            : "people"}{" "}
                                        found
                                    </span>
                                </div>
                            </div>

                            <div className="user-results">

                                {users.map((user) => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        className="user-result-card"
                                        onClick={() =>
                                            handleUserClick(user.id)
                                        }
                                        aria-label={`View ${user.username}'s profile`}
                                    >
                                        <UserAvatar
                                            user={user}
                                            size="large"
                                        />

                                        <div className="user-result-info">

                                            <strong>
                                                {user.firstName}{" "}
                                                {user.lastName}
                                            </strong>

                                            <span>
                                                @{user.username}
                                            </span>

                                            {user.bio && (
                                                <p>
                                                    {user.bio}
                                                </p>
                                            )}

                                        </div>

                                        <span
                                            className="user-result-action"
                                            aria-hidden="true"
                                        >
                                            <ArrowRight size={18} />
                                        </span>

                                    </button>
                                ))}

                            </div>

                        </section>
                    )}

                {/* No results */}
                {!loading &&
                    !error &&
                    searched &&
                    users.length === 0 && (
                        <section className="empty-search-state">

                            <div className="empty-search-icon">
                                <UserRound size={28} />
                            </div>

                            <h3>No people found</h3>

                            <p>
                                We couldn't find anyone matching{" "}
                                <strong>"{query}"</strong>.
                            </p>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClear}
                            >
                                Clear search
                            </button>

                        </section>
                    )}

                {/* Initial state */}
                {!searched && (
                    <section className="search-intro">

                        <div className="search-intro-icon">
                            <UserRound size={24} />
                        </div>

                        <div>
                            <h3>Start discovering</h3>

                            <p>
                                Search for friends, teammates, or other
                                people using their name or username.
                            </p>
                        </div>

                    </section>
                )}

            </div>
        </div>
    );
};

export default UserSearch;

