package com.social.platform.conversation.message.controller;

import com.social.platform.conversation.message.dto.MessageResponse;
import com.social.platform.conversation.message.dto.SendMessageRequest;
import com.social.platform.conversation.message.service.MessageService;
import com.social.platform.security.AuthenticatedUserService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.security.core.Authentication;

import org.springframework.stereotype.Controller;

import java.security.Principal;


@Controller
@RequiredArgsConstructor
public class MessageWebSocketController {


    private final MessageService messageService;


    private final AuthenticatedUserService
            authenticatedUserService;


    private final SimpMessagingTemplate
            messagingTemplate;


    /* =========================================================
       SEND MESSAGE
    ========================================================= */

    @MessageMapping("/chat.send")
    public void sendMessage(

            @Valid
            @Payload
            SendMessageRequest request,

            Principal principal

    ) {

        System.out.println(
                "🔥🔥🔥 CHAT SEND CONTROLLER REACHED 🔥🔥🔥"
        );


        System.out.println(
                "Conversation ID: "
                        + request.conversationId()
        );


        System.out.println(
                "Content: "
                        + request.content()
        );


        System.out.println(
                "Principal: "
                        + principal
        );


        /*
         * The STOMP CONNECT interceptor attaches
         * the authenticated user using:
         *
         * accessor.setUser(authentication)
         *
         * Spring exposes that user here as Principal.
         */

        if (principal == null) {

            throw new IllegalStateException(
                    "WebSocket principal is missing"
            );
        }


        System.out.println(
                "Principal name: "
                        + principal.getName()
        );


        System.out.println(
                "Principal class: "
                        + principal.getClass().getName()
        );


        /*
         * Our AuthenticatedUserService currently
         * expects Spring Security Authentication.
         *
         * JwtStompInterceptor creates a
         * UsernamePasswordAuthenticationToken,
         * which implements Authentication.
         */

        Authentication authentication =
                (Authentication) principal;


        /*
         * Identify the authenticated user.
         */

        Long currentUserId =
                authenticatedUserService
                        .getCurrentUserId(
                                authentication
                        );


        System.out.println(
                "Authenticated user ID: "
                        + currentUserId
        );


        /*
         * Persist the message.
         */

        MessageResponse response =
                messageService.sendMessage(
                        currentUserId,
                        request.conversationId(),
                        request.content()
                );


        System.out.println(
                "Message persisted successfully."
        );


        System.out.println(
                "Message ID: "
                        + response.id()
        );


        /*
         * Broadcast the persisted message.
         */

        String destination =
                "/topic/conversations/"
                        + request.conversationId();


        System.out.println(
                "Broadcast destination: "
                        + destination
        );


        messagingTemplate.convertAndSend(
                destination,
                response
        );


        System.out.println(
                "Message broadcast successfully."
        );


        System.out.println(
                "=========================================="
        );
    }
}

