package com.social.platform.config;

import com.social.platform.security.JwtStompInterceptor;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {


    private final JwtStompInterceptor jwtStompInterceptor;


    /* =========================================================
       MESSAGE BROKER
    ========================================================= */

    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry registry
    ) {

        /*
         * Messages published to /topic are delivered
         * to subscribers.
         */
        registry.enableSimpleBroker(
                "/topic"
        );


        /*
         * Client -> server application messages.
         *
         * Example:
         *
         * /app/chat.send
         */
        registry.setApplicationDestinationPrefixes(
                "/app"
        );
    }


    /* =========================================================
       WEBSOCKET ENDPOINT
    ========================================================= */

    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry
    ) {

        registry
                .addEndpoint("/ws")
                .setAllowedOrigins(
                        "http://localhost:5173"
                );
    }


    /* =========================================================
       INBOUND STOMP CHANNEL
    ========================================================= */

    @Override
    public void configureClientInboundChannel(
            ChannelRegistration registration
    ) {

        /*
         * Authenticate STOMP CONNECT requests using JWT.
         */
        registration.interceptors(
                jwtStompInterceptor
        );
    }
}