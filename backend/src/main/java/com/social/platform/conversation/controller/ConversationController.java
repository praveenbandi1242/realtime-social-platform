package com.social.platform.conversation.controller;

import com.social.platform.conversation.dto.ConversationResponse;
import com.social.platform.conversation.dto.CreateConversationRequest;
import com.social.platform.conversation.service.ConversationService;
import com.social.platform.security.AuthenticatedUserService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    private final AuthenticatedUserService
            authenticatedUserService;


    @PostMapping
    public ResponseEntity<ConversationResponse>
    createConversation(
            @Valid
            @RequestBody
            CreateConversationRequest request,

            Authentication authentication
    ) {

        Long currentUserId =
                authenticatedUserService
                        .getCurrentUserId(authentication);

        ConversationResponse response =
                conversationService
                        .createDirectConversation(
                                currentUserId,
                                request.participantId()
                        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping
    public ResponseEntity<
            List<ConversationResponse>
            >
    getMyConversations(
            Authentication authentication
    ) {

        Long currentUserId =
                authenticatedUserService
                        .getCurrentUserId(authentication);

        return ResponseEntity.ok(
                conversationService
                        .getMyConversations(currentUserId)
        );
    }


    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponse>
    getConversation(
            @PathVariable Long conversationId,

            Authentication authentication
    ) {

        Long currentUserId =
                authenticatedUserService
                        .getCurrentUserId(authentication);

        return ResponseEntity.ok(
                conversationService.getConversation(
                        conversationId,
                        currentUserId
                )
        );
    }
}
