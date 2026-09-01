import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Bell,
    RefreshCw,
} from "lucide-react";

import {
    getNotifications,
    markNotificationAsRead,
} from "../api/notificationsApi";

import NotificationItem from "../components/notifications/NotificationItem";

const PAGE_SIZE = 20;

const NotificationsPage = () => {
    const [
        notifications,
        setNotifications,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        page,
        setPage,
    ] = useState(0);

    const [
        totalPages,
        setTotalPages,
    ] = useState(0);

    const [
        isLastPage,
        setIsLastPage,
    ] = useState(true);

    const loadNotifications =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getNotifications(
                        page,
                        PAGE_SIZE
                    );

                setNotifications(
                    Array.isArray(
                        data?.content
                    )
                        ? data.content
                        : []
                );

                setTotalPages(
                    data?.totalPages ?? 0
                );

                setIsLastPage(
                    data?.last ?? true
                );
            } catch (requestError) {
                console.error(
                    "Unable to load notifications:",
                    requestError
                );

                setError(
                    "Unable to load your notifications. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }, [page]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const handleRead = async (
        notification
    ) => {
        if (notification.read) {
            return;
        }

        try {
            await markNotificationAsRead(
                notification.id
            );

            setNotifications(
                (current) =>
                    current.map((item) =>
                        item.id ===
                        notification.id
                            ? {
                                  ...item,
                                  read: true,
                              }
                            : item
                    )
            );
        } catch (requestError) {
            console.error(
                "Unable to mark notification as read:",
                requestError
            );

            setError(
                "Unable to mark this notification as read. Please try again."
            );
        }
    };

    const handlePreviousPage = () => {
        if (page === 0 || loading) {
            return;
        }

        setPage(
            (current) =>
                Math.max(
                    current - 1,
                    0
                )
        );
    };

    const handleNextPage = () => {
        if (isLastPage || loading) {
            return;
        }

        setPage(
            (current) =>
                current + 1
        );
    };

    const hasNotifications =
        notifications.length > 0;

    return (
        <div className="page-content">
            <div className="content-container notifications-page">

                <header className="page-header">
                    <div className="page-header-icon">
                        <Bell size={21} />
                    </div>

                    <div>
                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay up to date with
                            activity on CConnect.
                        </p>
                    </div>
                </header>

                {error && (
                    <div className="notification-error">
                        <div className="notification-error-content">
                            <Bell size={18} />

                            <div>
                                <strong>
                                    Something went wrong
                                </strong>

                                <span>
                                    {error}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={
                                loadNotifications
                            }
                            disabled={loading}
                        >
                            <RefreshCw
                                size={15}
                                className={
                                    loading
                                        ? "spin"
                                        : ""
                                }
                            />

                            Retry
                        </button>
                    </div>
                )}

                <section className="card notifications-card">

                    {loading ? (
                        <div
                            className="notifications-loading"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="loader" />

                            <span>
                                Loading notifications...
                            </span>
                        </div>
                    ) : !hasNotifications ? (
                        <div
                            className="empty-state"
                            role="status"
                        >
                            <div className="empty-icon">
                                <Bell size={24} />
                            </div>

                            <h3>
                                You're all caught up
                            </h3>

                            <p>
                                No notifications yet.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="notification-list">
                                {notifications.map(
                                    (
                                        notification
                                    ) => (
                                        <NotificationItem
                                            key={
                                                notification.id
                                            }
                                            notification={
                                                notification
                                            }
                                            onRead={
                                                handleRead
                                            }
                                        />
                                    )
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="notification-pagination">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={
                                            handlePreviousPage
                                        }
                                        disabled={
                                            page ===
                                                0 ||
                                            loading
                                        }
                                    >
                                        Previous
                                    </button>

                                    <span>
                                        Page{" "}
                                        {page + 1}{" "}
                                        of{" "}
                                        {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={
                                            handleNextPage
                                        }
                                        disabled={
                                            isLastPage ||
                                            loading
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                </section>

            </div>
        </div>
    );
};

export default NotificationsPage;