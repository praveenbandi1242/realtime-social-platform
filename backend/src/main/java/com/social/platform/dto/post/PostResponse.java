package com.social.platform.dto.post;

import java.time.Instant;

public record PostResponse(

        Long id,

        Long userId,

        String username,

        String firstName,

        String lastName,

        String content,

        long likeCount,

        long commentCount,

        boolean likedByCurrentUser,

        Instant createdAt,

        Instant updatedAt

) {
}