package com.social.platform.conversation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateMessageRequest(

        @NotBlank(
                message = "Message cannot be empty"
        )
        @Size(
                max = 2000,
                message = "Message cannot exceed 2000 characters"
        )
        String content

) {
}