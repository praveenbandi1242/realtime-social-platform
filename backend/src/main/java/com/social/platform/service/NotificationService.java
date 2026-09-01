package com.social.platform.service;

import com.social.platform.dto.notification.NotificationResponse;
import com.social.platform.dto.post.PageResponse;
import com.social.platform.entity.*;
import com.social.platform.exception.ResourceNotFoundException;
import com.social.platform.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createNotification(
            Long recipientId,
            Long actorId,
            NotificationType type,
            String message,
            Long referenceId
    ) {

        if (recipientId.equals(actorId)) {
            return;
        }

        User recipient =
                userRepository
                        .findById(recipientId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        Notification notification =
                Notification.builder()
                        .user(recipient)
                        .type(type)
                        .message(message)
                        .actorId(actorId)
                        .referenceId(referenceId)
                        .read(false)
                        .build();

        notificationRepository.save(
                notification
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getNotifications(
            Long userId,
            int page,
            int size
    ) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        Math.min(size, 50),
                        Sort.by(
                                Sort.Direction.DESC,
                                "createdAt"
                        )
                );

        Page<Notification> notifications =
                notificationRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                userId,
                                pageable
                        );

        return new PageResponse<>(
                notifications.getContent()
                        .stream()
                        .map(notification ->
                                new NotificationResponse(
                                        notification.getId(),
                                        notification.getType(),
                                        notification.getMessage(),
                                        notification.getActorId(),
                                        notification.getReferenceId(),
                                        notification.isRead(),
                                        notification.getCreatedAt()
                                )
                        )
                        .toList(),

                notifications.getNumber(),
                notifications.getSize(),
                notifications.getTotalElements(),
                notifications.getTotalPages(),
                notifications.isFirst(),
                notifications.isLast()
        );
    }

    @Transactional
    public void markAsRead(
            Long notificationId,
            Long userId
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found"
                                )
                        );

        if (!notification
                .getUser()
                .getId()
                .equals(userId)) {

            throw new com.social.platform.exception.UnauthorizedException(
                    "You cannot modify this notification"
            );
        }

        notification.setRead(true);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(
            Long userId
    ) {

        return notificationRepository
                .countByUserIdAndReadFalse(userId);
    }
}