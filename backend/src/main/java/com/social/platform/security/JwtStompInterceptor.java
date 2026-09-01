package com.social.platform.security;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;

import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class JwtStompInterceptor
        implements ChannelInterceptor {


    private final JwtService jwtService;

    private final CustomUserDetailsService
            userDetailsService;


    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }


        StompCommand command =
                accessor.getCommand();


        System.out.println(
                "========== STOMP INTERCEPTOR =========="
        );

        System.out.println(
                "STOMP command: "
                        + command
        );


        /*
         * =====================================================
         * CONNECT
         * =====================================================
         *
         * Authenticate the WebSocket session.
         */

        if (StompCommand.CONNECT.equals(command)) {

            String authorization =
                    accessor.getFirstNativeHeader(
                            "Authorization"
                    );


            System.out.println(
                    "Authorization header present: "
                            + (authorization != null)
            );


            if (
                    authorization == null ||
                            !authorization.startsWith("Bearer ")
            ) {

                throw new IllegalArgumentException(
                        "Missing WebSocket authorization"
                );
            }


            String token =
                    authorization.substring(7);


            String username =
                    jwtService.extractUsername(token);


            System.out.println(
                    "WebSocket username: "
                            + username
            );


            if (
                    username == null ||
                            username.isBlank()
            ) {

                throw new IllegalArgumentException(
                        "Invalid WebSocket token"
                );
            }


            UserDetails userDetails =
                    userDetailsService
                            .loadUserByUsername(
                                    username
                            );


            if (
                    !jwtService.isTokenValid(
                            token,
                            userDetails
                    )
            ) {

                throw new IllegalArgumentException(
                        "Invalid WebSocket token"
                );
            }


            UsernamePasswordAuthenticationToken
                    authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );


            /*
             * Attach authentication to the STOMP session.
             */
            accessor.setUser(
                    authentication
            );


            System.out.println(
                    "Authentication attached to STOMP session:"
            );

            System.out.println(
                    "User: "
                            + authentication.getName()
            );

            System.out.println(
                    "Authenticated: "
                            + authentication.isAuthenticated()
            );

            System.out.println(
                    "========================================"
            );
        }


        /*
         * =====================================================
         * NON-CONNECT MESSAGES
         * =====================================================
         *
         * Check whether the STOMP session already has
         * an authenticated user.
         */

        else {

            System.out.println(
                    "Existing STOMP user: "
                            + accessor.getUser()
            );

            if (accessor.getUser() != null) {

                System.out.println(
                        "Existing STOMP username: "
                                + accessor
                                .getUser()
                                .getName()
                );

            } else {

                System.out.println(
                        "⚠️ NO USER ATTACHED TO STOMP MESSAGE"
                );
            }

            System.out.println(
                    "========================================"
            );
        }


        return message;
    }
}