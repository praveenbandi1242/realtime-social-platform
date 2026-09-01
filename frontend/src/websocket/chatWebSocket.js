import { Client } from "@stomp/stompjs";


const WS_URL =
    import.meta.env.VITE_WS_BASE_URL ||
    "ws://localhost:8080/ws";


console.log(
    "========== CHAT WEBSOCKET MODULE =========="
);

console.log(
    "WebSocket URL:",
    WS_URL
);


/* =========================================================
   CREATE CHAT WEBSOCKET
========================================================= */

export const createChatWebSocket = ({
    token,
    conversationId,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
}) => {

    console.log(
        "========== CREATE CHAT WEBSOCKET =========="
    );

    console.log({
        WS_URL,
        tokenExists: Boolean(token),
        conversationId,
    });


    if (!token || !conversationId) {

        console.error(
            "WebSocket NOT created because token or conversationId is missing.",
            {
                tokenExists: Boolean(token),
                conversationId,
            }
        );

        return null;
    }


    const client = new Client({

        brokerURL: WS_URL,

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,

        heartbeatIncoming: 10000,

        heartbeatOutgoing: 10000,

        debug: (message) => {

            console.log(
                "[STOMP]",
                message
            );
        },

    });


    /* =====================================================
       STOMP CONNECTED
    ===================================================== */

    client.onConnect = (frame) => {

        console.log(
            "========== STOMP CONNECTED =========="
        );

        console.log(
            "STOMP frame:",
            frame
        );


        const destination =
            `/topic/conversations/${conversationId}`;


        console.log(
            "Subscribing to:",
            destination
        );


        client.subscribe(
            destination,
            (messageFrame) => {

                console.log(
                    "========== MESSAGE RECEIVED =========="
                );

                console.log(
                    "Raw frame:",
                    messageFrame
                );


                try {

                    const message =
                        JSON.parse(
                            messageFrame.body
                        );


                    console.log(
                        "Parsed message:",
                        message
                    );


                    onMessage?.(message);

                } catch (error) {

                    console.error(
                        "Unable to parse WebSocket message:",
                        error
                    );
                }
            }
        );


        onConnect?.();
    };


    /* =====================================================
       STOMP ERROR
    ===================================================== */

    client.onStompError = (frame) => {

        console.error(
            "========== STOMP BROKER ERROR =========="
        );

        console.error(
            "Headers:",
            frame.headers
        );

        console.error(
            "Message:",
            frame.headers?.message
        );

        console.error(
            "Body:",
            frame.body
        );


        onError?.(
            frame.headers?.message ||
            "WebSocket broker error."
        );
    };


    /* =====================================================
       RAW WEBSOCKET ERROR
    ===================================================== */

    client.onWebSocketError = (event) => {

        console.error(
            "========== RAW WEBSOCKET ERROR =========="
        );

        console.error(
            event
        );


        onError?.(
            "Unable to establish real-time connection."
        );
    };


    /* =====================================================
       WEBSOCKET CLOSE
    ===================================================== */

    client.onWebSocketClose = (event) => {

        console.error(
            "========== WEBSOCKET CLOSED =========="
        );

        console.error({
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
        });


        onDisconnect?.();
    };


    /* =====================================================
       STOMP DISCONNECT
    ===================================================== */

    client.onDisconnect = () => {

        console.log(
            "========== STOMP DISCONNECTED =========="
        );


        onDisconnect?.();
    };


    /* =====================================================
       ACTIVATE
    ===================================================== */

    console.log(
        "========== ACTIVATING STOMP CLIENT =========="
    );

    console.log(
        "brokerURL:",
        client.brokerURL
    );


    client.activate();


    return client;
};


/* =========================================================
   SEND CHAT MESSAGE
========================================================= */

export const sendChatMessage = (
    client,
    conversationId,
    content
) => {

    console.log(
        "========== SEND CHAT MESSAGE =========="
    );

    console.log({
        clientExists: Boolean(client),
        active: client?.active,
        connected: client?.connected,
        conversationId,
        content,
    });


    if (!client) {

        console.error(
            "Cannot send: WebSocket client does not exist."
        );

        return false;
    }


    if (!client.connected) {

        console.error(
            "Cannot send: WebSocket is not connected."
        );

        return false;
    }


    if (
        !conversationId ||
        !content?.trim()
    ) {

        console.error(
            "Cannot send: conversationId or content is missing."
        );

        return false;
    }


    client.publish({

        destination:
            "/app/chat.send",

        body: JSON.stringify({

            conversationId,

            content:
                content.trim(),

        }),

    });


    console.log(
        "Message published to /app/chat.send"
    );


    return true;
};