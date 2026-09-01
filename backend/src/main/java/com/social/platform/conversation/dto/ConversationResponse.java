package com.social.platform.conversation.dto;

import com.social.platform.conversation.model.ConversationType;

import java.time.Instant;
import java.util.List;

public record ConversationResponse(

        Long id,

        ConversationType type,

        Instant createdAt,

        ConversationParticipantResponse participant,

        String lastMessagePreview,

        Instant lastMessageAt

) {
}
