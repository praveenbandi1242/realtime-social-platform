package com.social.platform.conversation.service;

import com.social.platform.conversation.dto.ConversationParticipantResponse;
import com.social.platform.conversation.dto.ConversationResponse;
import com.social.platform.conversation.model.Conversation;
import com.social.platform.conversation.model.ConversationParticipant;
import com.social.platform.conversation.model.ConversationType;
import com.social.platform.conversation.repository.ConversationParticipantRepository;
import com.social.platform.conversation.repository.ConversationRepository;
import com.social.platform.entity.User;
import com.social.platform.exception.BadRequestException;
import com.social.platform.exception.ResourceNotFoundException;
import com.social.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConversationService {

    private final ConversationRepository conversationRepository;

    private final ConversationParticipantRepository
            participantRepository;

    private final UserRepository userRepository;


    @Transactional
    public ConversationResponse createDirectConversation(
            Long currentUserId,
            Long participantId
    ) {

        validateParticipant(
                currentUserId,
                participantId
        );

        User currentUser =
                getUser(currentUserId);

        User participant =
                getUser(participantId);

        String directKey =
                createDirectKey(
                        currentUserId,
                        participantId
                );

        /*
         * First check:
         *
         * If the conversation already exists,
         * simply return it.
         */
        return conversationRepository
                .findByDirectKey(directKey)
                .map(conversation ->
                        toResponse(
                                conversation,
                                currentUserId
                        )
                )
                .orElseGet(() ->
                        createConversationSafely(
                                currentUser,
                                participant,
                                directKey
                        )
                );
    }


    public List<ConversationResponse>
    getMyConversations(Long currentUserId) {

        return participantRepository
                .findConversationsForUser(currentUserId)
                .stream()
                .map(participant ->
                        toResponse(
                                participant.getConversation(),
                                currentUserId
                        )
                )
                .toList();
    }


    public ConversationResponse
    getConversation(
            Long conversationId,
            Long currentUserId
    ) {

        ConversationParticipant membership =
                participantRepository
                        .findByConversationIdAndUserId(
                                conversationId,
                                currentUserId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Conversation not found"
                                )
                        );

        return toResponse(
                membership.getConversation(),
                currentUserId
        );
    }


    private ConversationResponse
    createConversationSafely(
            User currentUser,
            User participant,
            String directKey
    ) {

        try {

            Conversation conversation =
                    conversationRepository.save(
                            Conversation.builder()
                                    .type(
                                            ConversationType.DIRECT
                                    )
                                    .directKey(directKey)
                                    .build()
                    );

            participantRepository.save(
                    ConversationParticipant.builder()
                            .conversation(conversation)
                            .user(currentUser)
                            .build()
            );

            participantRepository.save(
                    ConversationParticipant.builder()
                            .conversation(conversation)
                            .user(participant)
                            .build()
            );

            return toResponse(
                    conversation,
                    currentUser.getId()
            );

        } catch (DataIntegrityViolationException ex) {

            /*
             * Handles a race condition:
             *
             * Request A:
             *   checks → doesn't exist
             *
             * Request B:
             *   checks → doesn't exist
             *
             * Both try INSERT.
             *
             * PostgreSQL allows only one because
             * direct_key is UNIQUE.
             *
             * The losing request retrieves the
             * already-created conversation.
             */

            Conversation existing =
                    conversationRepository
                            .findByDirectKey(directKey)
                            .orElseThrow(() -> ex);

            return toResponse(
                    existing,
                    currentUser.getId()
            );
        }
    }


    private ConversationResponse
    toResponse(
            Conversation conversation,
            Long currentUserId
    ) {

        List<ConversationParticipant>
                participants =
                participantRepository
                        .findByConversationId(
                                conversation.getId()
                        );

        ConversationParticipantResponse
                otherParticipant =
                participants.stream()
                        .map(ConversationParticipant::getUser)
                        .filter(user ->
                                !user.getId()
                                        .equals(currentUserId)
                        )
                        .findFirst()
                        .map(this::toParticipantResponse)
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Conversation participant missing"
                                )
                        );

        return new ConversationResponse(
                conversation.getId(),
                conversation.getType(),
                conversation.getCreatedAt(),
                otherParticipant,
                null,
                null
        );
    }


    private ConversationParticipantResponse
    toParticipantResponse(User user) {

        return new ConversationParticipantResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getProfileImageUrl()
        );
    }


    private User getUser(Long userId) {

        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }


    private void validateParticipant(
            Long currentUserId,
            Long participantId
    ) {

        if (currentUserId.equals(participantId)) {

            throw new BadRequestException(
                    "You cannot start a conversation with yourself"
            );
        }
    }


    private String createDirectKey(
            Long firstUserId,
            Long secondUserId
    ) {

        long smaller =
                Math.min(
                        firstUserId,
                        secondUserId
                );

        long larger =
                Math.max(
                        firstUserId,
                        secondUserId
                );

        return smaller + ":" + larger;
    }
}
