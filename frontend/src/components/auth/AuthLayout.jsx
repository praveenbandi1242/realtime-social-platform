import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
    return (
        <main className="auth-page">
            <div className="auth-background-orb auth-orb-one" />
            <div className="auth-background-orb auth-orb-two" />

            <section className="auth-container">
                <div className="auth-brand">
                    <div className="brand-mark">
                        ✦
                    </div>

                    <span>Socially</span>
                </div>

                <div className="auth-card">
                    {children}
                </div>

                <p className="auth-footer">
                    Connect. Share. Engage.
                </p>
            </section>
        </main>
    );
};

export default AuthLayout;