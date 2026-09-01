package com.social.platform.controller;

import com.social.platform.dto.notification.NotificationResponse;
import com.social.platform.dto.post.PageResponse;
import com.social.platform.security.CurrentUserService;
import com.social.platform.service.NotificationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ResponseEntity<PageResponse<NotificationResponse>>
    getNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {

        return ResponseEntity.ok(
                notificationService.getNotifications(
                        currentUserService.getCurrentUserId(authentication),
                        Math.max(page, 0),
                        Math.max(size, 1)
                )
        );
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            Authentication authentication,
            @PathVariable Long id
    ) {

        notificationService.markAsRead(
                id,
                currentUserService.getCurrentUserId(authentication)
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> unreadCount(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                notificationService.getUnreadCount(
                        currentUserService.getCurrentUserId(authentication)
                )
        );
    }

}