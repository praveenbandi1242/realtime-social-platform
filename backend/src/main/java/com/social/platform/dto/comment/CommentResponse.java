package com.social.platform.dto.comment;

import java.time.Instant;

public record CommentResponse(

        Long id,

        Long postId,

        Long userId,

        String username,

        String firstName,

        String lastName,

        String content,

        Instant createdAt,

        Instant updatedAt

) {
}