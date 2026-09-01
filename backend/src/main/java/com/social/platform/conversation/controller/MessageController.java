package com.social.platform.conversation.controller;

import com.social.platform.conversation.dto.CreateMessageRequest;
import com.social.platform.conversation.message.dto.MessageResponse;
import com.social.platform.conversation.message.service.MessageService;
import com.social.platform.security.AuthenticatedUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conversations/{conversationId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    private final AuthenticatedUserService
            authenticatedUserService;


    @PostMapping
    public ResponseEntity<MessageResponse>
    createMessage(

            @PathVariable
            Long conversationId,

            @Valid
            @RequestBody
            CreateMessageRequest request,

            Authentication authentication
    ) {

        Long currentUserId =
                authenticatedUserService
                        .getCurrentUserId(
                                authentication
                        );

        MessageResponse response =
                messageService.createMessage(
                        conversationId,
                        currentUserId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping
    public ResponseEntity<Page<MessageResponse>>
    getMessages(

            @PathVariable
            Long conversationId,

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "50"
            )
            int size,

            Authentication authentication
    ) {

        Long currentUserId =
                authenticatedUserService
                        .getCurrentUserId(
                                authentication
                        );

        Page<MessageResponse> messages =
                messageService.getMessages(
                        conversationId,
                        currentUserId,
                        page,
                        size
                );

        return ResponseEntity.ok(messages);
    }
}