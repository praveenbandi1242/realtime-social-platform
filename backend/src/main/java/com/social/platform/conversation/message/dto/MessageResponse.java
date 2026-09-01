package com.social.platform.conversation.message.dto;

import java.time.Instant;

public record MessageResponse(

        Long id,

        Long conversationId,

        Long senderId,

        String senderUsername,

        String senderFirstName,

        String senderLastName,

        String content,

        Instant createdAt

) {
}