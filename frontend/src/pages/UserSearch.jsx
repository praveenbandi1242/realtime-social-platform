import { useState } from "react";

import Navbar from "../components/Navbar";
import { searchUsers } from "../api/userApi";

const UserSearch = () => {

    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    const handleSearch = async (event) => {

        event.preventDefault();

        if (!query.trim()) {
            setUsers([]);
            return;
        }

        try {

            const result =
                await searchUsers(query);

            setUsers(result.content);

        } catch {

            setUsers([]);
        }
    };

    return (
        <>
            <Navbar />

            <main className="page">

                <section className="search-card">

                    <h1>Find people</h1>

                    <form onSubmit={handleSearch}>

                        <input
                            value={query}
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                            placeholder="Search users..."
                        />

                        <button type="submit">
                            Search
                        </button>

                    </form>

                    <div className="user-results">

                        {users.map((user) => (

                            <div
                                className="user-result"
                                key={user.id}
                            >

                                <div className="avatar">
                                    {user.firstName[0]}
                                </div>

                                <div>
                                    <strong>
                                        {user.firstName}{" "}
                                        {user.lastName}
                                    </strong>

                                    <span>
                                        @{user.username}
                                    </span>
                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            </main>
        </>
    );
};

export default UserSearch;