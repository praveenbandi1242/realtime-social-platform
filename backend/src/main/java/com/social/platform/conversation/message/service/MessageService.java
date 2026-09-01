package com.social.platform.conversation.message.service;

import com.social.platform.conversation.dto.CreateMessageRequest;
import com.social.platform.conversation.message.dto.MessageResponse;
import com.social.platform.conversation.model.Conversation;
import com.social.platform.conversation.model.ConversationParticipant;
import com.social.platform.conversation.model.Message;
import com.social.platform.conversation.repository.ConversationParticipantRepository;
import com.social.platform.conversation.repository.ConversationRepository;
import com.social.platform.conversation.repository.MessageRepository;
import com.social.platform.entity.User;
import com.social.platform.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MessageService {


    private final MessageRepository messageRepository;


    private final ConversationRepository conversationRepository;


    private final ConversationParticipantRepository
            participantRepository;


    /* =========================================================
       CREATE MESSAGE - REST
    ========================================================= */

    @Transactional
    public MessageResponse createMessage(
            Long conversationId,
            Long senderId,
            CreateMessageRequest request
    ) {

        ConversationParticipant membership =
                getMembership(
                        conversationId,
                        senderId
                );


        Conversation conversation =
                membership.getConversation();


        User sender =
                membership.getUser();


        Message message =
                Message.builder()
                        .conversation(conversation)
                        .sender(sender)
                        .content(request.content().trim())
                        .build();


        Message savedMessage =
                messageRepository.saveAndFlush(
                        message
                );


        return toResponse(
                savedMessage
        );
    }


    /* =========================================================
       GET MESSAGES
    ========================================================= */

    public Page<MessageResponse> getMessages(
            Long conversationId,
            Long currentUserId,
            int page,
            int size
    ) {

        /*
         * Verify that the requesting user belongs
         * to this conversation.
         */
        getMembership(
                conversationId,
                currentUserId
        );


        int safePage =
                Math.max(
                        page,
                        0
                );


        int safeSize =
                Math.min(
                        Math.max(
                                size,
                                1
                        ),
                        50
                );


        Pageable pageable =
                PageRequest.of(
                        safePage,
                        safeSize,
                        Sort.by(
                                Sort.Direction.DESC,
                                "createdAt"
                        )
                );


        return messageRepository
                .findByConversationIdOrderByCreatedAtDesc(
                        conversationId,
                        pageable
                )
                .map(this::toResponse);
    }


    /* =========================================================
       SEND MESSAGE - WEBSOCKET
    ========================================================= */

    @Transactional
    public MessageResponse sendMessage(
            Long currentUserId,
            Long conversationId,
            String content
    ) {

        System.out.println(
                "========== MESSAGE SERVICE SEND =========="
        );


        /*
         * Validate content.
         */
        if (
                content == null ||
                        content.trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Message content cannot be empty"
            );
        }


        /*
         * Verify that the authenticated user
         * belongs to this conversation.
         */
        ConversationParticipant membership =
                getMembership(
                        conversationId,
                        currentUserId
                );


        Conversation conversation =
                membership.getConversation();


        User sender =
                membership.getUser();


        System.out.println(
                "Conversation found: "
                        + conversation.getId()
        );


        System.out.println(
                "Sender found: "
                        + sender.getId()
        );


        /*
         * Create message.
         */
        Message message =
                Message.builder()
                        .conversation(conversation)
                        .sender(sender)
                        .content(content.trim())
                        .build();


        /*
         * IMPORTANT:
         *
         * saveAndFlush() forces Hibernate to execute
         * the INSERT immediately.
         *
         * Therefore the generated ID and createdAt
         * are available before we broadcast the response.
         */
        Message savedMessage =
                messageRepository.saveAndFlush(
                        message
                );


        System.out.println(
                "Message saved."
        );


        System.out.println(
                "Message ID: "
                        + savedMessage.getId()
        );


        System.out.println(
                "Message createdAt: "
                        + savedMessage.getCreatedAt()
        );


        MessageResponse response =
                toResponse(
                        savedMessage
                );


        System.out.println(
                "MessageResponse created."
        );


        System.out.println(
                "Response ID: "
                        + response.id()
        );


        System.out.println(
                "Response content: "
                        + response.content()
        );


        System.out.println(
                "=========================================="
        );


        return response;
    }


    /* =========================================================
       CONVERSATION MEMBERSHIP
    ========================================================= */

    private ConversationParticipant
    getMembership(
            Long conversationId,
            Long userId
    ) {

        return participantRepository
                .findByConversationIdAndUserId(
                        conversationId,
                        userId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Conversation not found"
                        )
                );
    }


    /* =========================================================
       RESPONSE MAPPING
    ========================================================= */

    private MessageResponse
    toResponse(
            Message message
    ) {

        User sender =
                message.getSender();


        return new MessageResponse(
                message.getId(),
                message.getConversation().getId(),
                sender.getId(),
                sender.getUsername(),
                sender.getFirstName(),
                sender.getLastName(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}