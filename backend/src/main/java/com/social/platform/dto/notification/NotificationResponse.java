package com.social.platform.dto.notification;

import com.social.platform.entity.NotificationType;

import java.time.Instant;

public record NotificationResponse(

        Long id,

        NotificationType type,

        String message,

        Long actorId,

        Long referenceId,

        boolean read,

        Instant createdAt

) {
}