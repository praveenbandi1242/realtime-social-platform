package com.social.platform.conversation.dto;

import jakarta.validation.constraints.NotNull;

public record CreateConversationRequest(

        @NotNull(message = "Participant ID is required")
        Long participantId

) {
}
