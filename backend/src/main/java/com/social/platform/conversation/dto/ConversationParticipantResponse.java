package com.social.platform.conversation.dto;

public record ConversationParticipantResponse(

        Long id,

        String username,

        String firstName,

        String lastName,

        String profileImageUrl

) {
}