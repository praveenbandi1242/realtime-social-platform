import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Home = () => {

    const { user } = useAuth();

    return (
        <>
            <Navbar />

            <main className="page">

                <section className="welcome-card">

                    <h1>
                        Welcome, {user.firstName}
                    </h1>

                    <p>
                        Your social communication platform is ready.
                    </p>

                    <div className="phase-info">

                        <h2>Phase 1</h2>

                        <ul>
                            <li>Authentication</li>
                            <li>User profiles</li>
                            <li>JWT security</li>
                            <li>User search</li>
                            <li>PostgreSQL</li>
                        </ul>

                    </div>

                </section>

            </main>
        </>
    );
};

export default Home;