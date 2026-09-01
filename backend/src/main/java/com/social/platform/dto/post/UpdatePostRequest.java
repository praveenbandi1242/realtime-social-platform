package com.social.platform.dto.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePostRequest(

        @NotBlank(message = "Post content is required")
        @Size(
                min = 1,
                max = 5000,
                message = "Post content must be between 1 and 5000 characters"
        )
        String content

) {
}