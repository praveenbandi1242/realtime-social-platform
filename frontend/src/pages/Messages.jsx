import {
    MessageCircle,
    Plus,
    Search,
    ArrowLeft,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import UserAvatar from "../components/users/UserAvatar";

import MessageBubble from "../components/messages/MessageBubble";
import MessageComposer from "../components/messages/MessageComposer";

import {
    createConversation,
    getConversations,
} from "../api/conversationApi";

import {
    getMessages,
} from "../api/messageApi";

import { useAuth } from "../context/AuthContext";

import {
    createChatWebSocket,
    sendChatMessage,
} from "../websocket/chatWebSocket";


/* =========================================================
   HELPERS
========================================================= */

const getDisplayName = (user) => {

    const fullName =
        `${user?.firstName || ""} ${
            user?.lastName || ""
        }`.trim();

    return (
        fullName ||
        user?.username ||
        "Unknown user"
    );
};


const formatConversationTime = (timestamp) => {

    if (!timestamp) {
        return "";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            month: "short",
            day: "numeric",
        }
    ).format(date);
};


/* =========================================================
   MESSAGES PAGE
========================================================= */

export default function Messages() {

    const navigate = useNavigate();

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    /*
     * Authentication
     *
     * The JWT token is required by the WebSocket
     * connection.
     */
    const { token } = useAuth();


    /* =====================================================
       CONVERSATIONS STATE
    ===================================================== */

    const [
        conversations,
        setConversations,
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
        search,
        setSearch,
    ] = useState("");

    const [
        creating,
        setCreating,
    ] = useState(false);


    /* =====================================================
       MESSAGES STATE
    ===================================================== */

    const [
        messages,
        setMessages,
    ] = useState([]);

    const [
        messagesLoading,
        setMessagesLoading,
    ] = useState(false);

    const [
        messageSending,
        setMessageSending,
    ] = useState(false);

    const [
        messagesError,
        setMessagesError,
    ] = useState("");

    const messagesEndRef =
        useRef(null);


    /* =====================================================
       WEBSOCKET STATE
    ===================================================== */

    const [
        connectionStatus,
        setConnectionStatus,
    ] = useState("disconnected");

    const chatClientRef =
        useRef(null);


    /* =====================================================
       SELECTED CONVERSATION
    ===================================================== */

    const selectedConversationId =
        searchParams.get("conversation");


    /* =====================================================
       LOAD CONVERSATIONS
    ===================================================== */

    const loadConversations = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getConversations();

            const loadedConversations =
                Array.isArray(data)
                    ? data
                    : [];


            setConversations(
                loadedConversations
            );


            /*
             * Automatically select the first conversation
             * when /messages is opened without a selection.
             */
            if (
                loadedConversations.length > 0 &&
                !searchParams.get("conversation")
            ) {

                setSearchParams({
                    conversation:
                        loadedConversations[0].id,
                });
            }

        } catch (err) {

            console.error(
                "Unable to load conversations:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load your conversations."
            );

        } finally {

            setLoading(false);
        }
    };

    /* =====================================================
       INITIAL CONVERSATION LOAD
    ===================================================== */

    useEffect(() => {

        loadConversations();

    }, []);


    /* =====================================================
       FILTER CONVERSATIONS
    ===================================================== */

    const filteredConversations =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return conversations;
            }

            return conversations.filter(
                (conversation) => {

                    const user =
                        conversation.participant;

                    const name =
                        getDisplayName(user)
                            .toLowerCase();

                    const username =
                        user?.username
                            ?.toLowerCase() ||
                        "";

                    return (
                        name.includes(query) ||
                        username.includes(query)
                    );
                }
            );

        }, [
            conversations,
            search,
        ]);


    /* =====================================================
       START NEW CONVERSATION
    ===================================================== */

    const handleStartConversation =
        async (participantId) => {

            if (creating) {
                return;
            }

            try {

                setCreating(true);
                setError("");

                const conversation =
                    await createConversation(
                        participantId
                    );

                setConversations(
                    (current) => {

                        const exists =
                            current.some(
                                (item) =>
                                    String(item.id) ===
                                    String(
                                        conversation.id
                                    )
                            );

                        if (exists) {
                            return current;
                        }

                        return [
                            conversation,
                            ...current,
                        ];
                    }
                );

                setSearchParams({
                    conversation:
                        conversation.id,
                });

            } catch (err) {

                console.error(
                    "Unable to create conversation:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to start this conversation."
                );

            } finally {

                setCreating(false);
            }
        };


    /* =====================================================
       SELECTED CONVERSATION
    ===================================================== */

    const selectedConversation =
        conversations.find(
            (conversation) =>
                String(conversation.id) ===
                String(selectedConversationId)
        );

    /* =====================================================
       UPDATE CONVERSATION PREVIEW
    ===================================================== */

    const updateConversationPreview = (
        conversationId,
        message
    ) => {

        setConversations((current) =>
            current.map((conversation) => {

                if (
                    String(conversation.id) !==
                    String(conversationId)
                ) {
                    return conversation;
                }

                return {
                    ...conversation,

                    lastMessagePreview:
                        message.content,

                    lastMessageAt:
                        message.createdAt,
                };
            })
        );
    };

    /* =====================================================
       LOAD MESSAGES

       Runs whenever the selected conversation changes.
    ===================================================== */

    useEffect(() => {

        if (!selectedConversation?.id) {

            setMessages([]);

            setMessagesError("");

            return;
        }


        const loadMessages = async () => {

            try {

                setMessagesLoading(true);

                setMessagesError("");


                const result =
                    await getMessages(
                        selectedConversation.id,
                        0,
                        50
                    );


                /*
                 * Backend returns messages newest first.
                 *
                 * Chat UI displays oldest first.
                 */

                const loadedMessages =
                    Array.isArray(result?.content)
                        ? [...result.content].reverse()
                        : [];


                setMessages(
                    loadedMessages
                );

            } catch (error) {

                console.error(
                    "Unable to load messages:",
                    error
                );

                setMessagesError(
                    error.response?.data?.message ||
                    "Unable to load messages."
                );

                setMessages([]);

            } finally {

                setMessagesLoading(false);
            }
        };


        loadMessages();

    }, [
        selectedConversation?.id,
    ]);


    /* =====================================================
       WEBSOCKET CONNECTION
    ===================================================== */

    useEffect(() => {

        /*
         * No conversation or token means there is nothing
         * to connect to.
         */
        if (
            !selectedConversation?.id ||
            !token
        ) {

            setConnectionStatus(
                "disconnected"
            );

            return;
        }


        /*
         * Clean up any previous WebSocket connection.
         */
        if (chatClientRef.current) {

            chatClientRef.current.deactivate();

            chatClientRef.current = null;
        }


        /*
         * Connection is currently being established.
         */
        setConnectionStatus(
            "connecting"
        );


        const client =
            createChatWebSocket({

                token,

                conversationId:
                    selectedConversation.id,


                /* =============================================
                   MESSAGE RECEIVED
                ============================================= */

                onMessage: (incomingMessage) => {

                    setMessages((current) => {

                        /*
                         * Prevent duplicate messages.
                         */
                        const alreadyExists =
                            current.some(
                                (message) =>
                                    String(message.id) ===
                                    String(
                                        incomingMessage.id
                                    )
                            );


                        if (alreadyExists) {

                            return current;
                        }


                        /*
                         * Server sends the authoritative
                         * persisted message.
                         */
                        return [
                            ...current,
                            incomingMessage,
                        ];
                    });


                    /*
                     * Update sidebar conversation preview.
                     */
                    updateConversationPreview(
                        selectedConversation.id,
                        incomingMessage
                    );
                },


                /* =============================================
                   CONNECTED
                ============================================= */

                onConnect: () => {

                    console.log(
                        "Messages WebSocket connected"
                    );


                    setConnectionStatus(
                        "connected"
                    );


                    /*
                     * Clear any previous WebSocket error.
                     */
                    setMessagesError("");
                },


                /* =============================================
                   DISCONNECTED
                ============================================= */

                onDisconnect: () => {

                    console.log(
                        "Messages WebSocket disconnected"
                    );


                    setConnectionStatus(
                        "disconnected"
                    );
                },


                /* =============================================
                   ERROR
                ============================================= */

                onError: (webSocketError) => {

                    console.error(
                        "Messages WebSocket error:",
                        webSocketError
                    );


                    setConnectionStatus(
                        "error"
                    );


                    setMessagesError(
                        typeof webSocketError === "string"
                            ? webSocketError
                            : "Real-time connection error."
                    );
                },

            });


        /*
         * Store the active client.
         */
        chatClientRef.current =
            client;


        /* =================================================
           CLEANUP
        ================================================= */

        return () => {

            if (client) {

                client.deactivate();
            }


            if (
                chatClientRef.current ===
                client
            ) {

                chatClientRef.current =
                    null;
            }

        };

    }, [
        selectedConversation?.id,
        token,
    ]);

    /* =====================================================
       AUTO SCROLL TO LATEST MESSAGE
    ===================================================== */

    useEffect(() => {

        if (!messages.length) {
            return;
        }

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [
        messages,
    ]);


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    const handleSendMessage = async (content) => {

        if (!selectedConversation?.id) {
            return;
        }

        if (!content?.trim()) {
            return;
        }

        const client = chatClientRef.current;

        if (!client?.connected) {

            setMessagesError(
                "Chat is still connecting. Please wait a moment."
            );

            return;
        }

        setMessageSending(true);
        setMessagesError("");

        try {

            const sent = sendChatMessage(
                client,
                selectedConversation.id,
                content
            );

            if (!sent) {

                setMessagesError(
                    "Unable to send message. Please try again."
                );

                return;
            }

        } catch (error) {

            console.error(
                "Unable to send message:",
                error
            );

            setMessagesError(
                "Unable to send message. Please try again."
            );

            throw error;

        } finally {

            setMessageSending(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="messages-fullscreen">

            <div className="messages-page">


                {/* =================================================
                   PAGE HEADER
                ================================================= */}

                <header className="messages-page-header">

                    <div className="messages-title">

                        <div className="page-header-icon">

                            <MessageCircle
                                size={21}
                            />

                        </div>

                        <div>

                            <h1>
                                Messages
                            </h1>

                            <p>
                                Stay connected with your
                                conversations.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/search")
                        }
                    >

                        <Plus size={16} />

                        <span>
                            New message
                        </span>

                    </button>

                </header>


                {/* =================================================
                   GLOBAL ERROR
                ================================================= */}

                {error && (

                    <div className="messages-error">

                        <div className="messages-error-content">

                            <AlertCircle
                                size={17}
                            />

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
                                loadConversations
                            }
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* =================================================
                   MESSAGES SHELL
                ================================================= */}

                <section
                    className={`messages-shell card ${
                        selectedConversation
                            ? "has-selected"
                            : ""
                    }`}
                >


                    {/* =================================================
                       CONVERSATION SIDEBAR
                    ================================================= */}

                    <aside className="conversation-sidebar">

                        <div className="conversation-sidebar-header">

                            <div>

                                <h2>
                                    Conversations
                                </h2>

                                <span>

                                    {conversations.length}{" "}

                                    {conversations.length === 1
                                        ? "conversation"
                                        : "conversations"}

                                </span>

                            </div>

                        </div>


                        {/* =================================================
                           CONVERSATION SEARCH
                        ================================================= */}

                        <div className="conversation-search">

                            <Search
                                size={16}
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search conversations..."
                                aria-label="Search conversations"
                            />

                        </div>


                        {/* =================================================
                           CONVERSATION LIST
                        ================================================= */}

                        {loading ? (

                            <ConversationSkeleton />

                        ) : filteredConversations.length === 0 ? (

                            <div className="conversation-empty">

                                <div className="conversation-empty-icon">

                                    <MessageCircle
                                        size={21}
                                    />

                                </div>

                                <strong>

                                    {search
                                        ? "No conversations found"
                                        : "No conversations yet"}

                                </strong>

                                <span>

                                    {search
                                        ? "Try a different name or username."
                                        : "Start a conversation with someone from your community."}

                                </span>

                            </div>

                        ) : (

                            <div className="conversation-list">

                                {filteredConversations.map(
                                    (conversation) => {

                                        const user =
                                            conversation.participant;

                                        const isSelected =
                                            String(
                                                conversation.id
                                            ) ===
                                            String(
                                                selectedConversationId
                                            );


                                        return (

                                            <button
                                                key={
                                                    conversation.id
                                                }
                                                type="button"
                                                className={`conversation-item ${
                                                    isSelected
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSearchParams(
                                                        {
                                                            conversation:
                                                                conversation.id,
                                                        }
                                                    )
                                                }
                                            >

                                                <UserAvatar
                                                    user={user}
                                                    size="medium"
                                                />


                                                <div className="conversation-item-content">

                                                    <div className="conversation-item-top">

                                                        <strong>
                                                            {getDisplayName(
                                                                user
                                                            )}
                                                        </strong>


                                                        {conversation.lastMessageAt && (

                                                            <time>

                                                                {formatConversationTime(
                                                                    conversation.lastMessageAt
                                                                )}

                                                            </time>

                                                        )}

                                                    </div>


                                                    <div className="conversation-item-bottom">

                                                        <span>
                                                            @{user?.username}
                                                        </span>


                                                        <p>

                                                            {
                                                                conversation.lastMessagePreview ||
                                                                "No messages yet"
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </button>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </aside>


                    {/* =================================================
                       CONVERSATION PANEL
                    ================================================= */}

                    <main className="conversation-panel">

                        {!selectedConversation ? (

                            <ConversationWelcome />

                        ) : (

                            <ConversationView
                                conversation={
                                    selectedConversation
                                }
                                messages={
                                    messages
                                }
                                messagesLoading={
                                    messagesLoading
                                }
                                messagesError={
                                    messagesError
                                }
                                messageSending={
                                    messageSending
                                }
                                connectionStatus={
                                    connectionStatus
                                }
                                messagesEndRef={
                                    messagesEndRef
                                }
                                onSendMessage={
                                    handleSendMessage
                                }
                                onBack={() =>
                                    setSearchParams({})
                                }
                            />

                        )}

                    </main>

                </section>

            </div>

        </div>
    );
}


/* =========================================================
   CONVERSATION VIEW
========================================================= */

function ConversationView({
    conversation,
    messages,
    messagesLoading,
    messagesError,
    messageSending,
    connectionStatus,
    messagesEndRef,
    onSendMessage,
    onBack,
}) {

    const user =
        conversation.participant;


    return (

        <div className="conversation-placeholder">


            {/* =================================================
               CONVERSATION HEADER
            ================================================= */}

            <header className="conversation-header">

                <button
                    type="button"
                    className="conversation-back-button"
                    onClick={onBack}
                    aria-label="Back to conversations"
                >

                    <ArrowLeft
                        size={18}
                    />

                </button>


                <UserAvatar
                    user={user}
                    size="medium"
                />


                <div>

                    <strong>
                        {getDisplayName(user)}
                    </strong>

                    <span>
                        @{user?.username}
                    </span>

                </div>


                {/* =============================================
                   CONNECTION STATUS
                ============================================= */}

                <div
                    className={`chat-connection-status ${connectionStatus}`}
                    title={`Chat connection: ${connectionStatus}`}
                >

                    <span className="chat-connection-dot" />

                    <span>

                        {connectionStatus === "connected"
                            ? "Connected"
                            : connectionStatus === "connecting"
                            ? "Connecting..."
                            : connectionStatus === "error"
                            ? "Connection error"
                            : "Disconnected"}

                    </span>

                </div>

            </header>


            {/* =================================================
               MESSAGE AREA
            ================================================= */}

            <div className="conversation-message-area">


                {messagesError && (

                    <div className="conversation-message-error">

                        <AlertCircle
                            size={16}
                        />

                        <span>
                            {messagesError}
                        </span>

                    </div>

                )}


                {messagesLoading ? (

                    <div className="messages-loading">

                        <LoaderCircle
                            size={24}
                            className="spin"
                        />

                        <span>
                            Loading messages...
                        </span>

                    </div>

                ) : messages.length === 0 ? (

                    <div className="conversation-empty-messages">

                        <div className="conversation-placeholder-icon">

                            <MessageCircle
                                size={22}
                            />

                        </div>

                        <h3>
                            No messages yet
                        </h3>

                        <p>
                            Start the conversation by
                            sending a message below.
                        </p>

                    </div>

                ) : (

                    <div className="message-list">

                        {messages.map(
                            (message) => (

                                <MessageBubble
                                    key={
                                        message.id
                                    }
                                    message={
                                        message
                                    }
                                />

                            )
                        )}


                        <div
                            ref={
                                messagesEndRef
                            }
                        />

                    </div>

                )}

            </div>


            {/* =================================================
               MESSAGE COMPOSER
            ================================================= */}

            <MessageComposer
                onSend={onSendMessage}
                sending={messageSending}
                disabled={false}
            />

        </div>
    );
}


/* =========================================================
   CONVERSATION SKELETON
========================================================= */

function ConversationSkeleton() {

    return (

        <div className="conversation-list">

            {[1, 2, 3, 4].map(
                (item) => (

                    <div
                        key={item}
                        className="conversation-skeleton"
                    >

                        <div className="skeleton skeleton-avatar" />


                        <div className="conversation-skeleton-content">

                            <div className="skeleton skeleton-line-long" />

                            <div className="skeleton skeleton-line-short" />

                        </div>

                    </div>

                )
            )}

        </div>
    );
}


/* =========================================================
   WELCOME STATE
========================================================= */

function ConversationWelcome() {

    return (

        <div className="conversation-welcome">

            <div className="conversation-welcome-icon">

                <MessageCircle
                    size={26}
                />

            </div>


            <h2>
                Your messages
            </h2>


            <p>
                Select a conversation to view
                your messages.
            </p>


            <span>
                Choose someone from your
                conversations to start chatting.
            </span>

        </div>
    );
}

