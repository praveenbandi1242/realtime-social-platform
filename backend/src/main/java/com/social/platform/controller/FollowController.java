package com.social.platform.controller;

import com.social.platform.dto.follow.FollowUserResponse;
import com.social.platform.security.CurrentUserService;
import com.social.platform.service.FollowService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final CurrentUserService currentUserService;

    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> follow(
            Authentication authentication,
            @PathVariable Long id
    ) {

        Long currentUserId =
                currentUserService.getCurrentUserId(
                        authentication
                );

        followService.follow(
                currentUserId,
                id
        );

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/follow")
    public ResponseEntity<Void> unfollow(
            Authentication authentication,
            @PathVariable Long id
    ) {

        Long currentUserId =
                currentUserService.getCurrentUserId(
                        authentication
                );

        followService.unfollow(
                currentUserId,
                id
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<Page<FollowUserResponse>> getFollowing(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Long viewerUserId =
                currentUserService.getCurrentUserId(
                        authentication
                );

        return ResponseEntity.ok(
                followService.getFollowing(
                        id,
                        Math.max(page, 0),
                        Math.max(size, 1),
                        viewerUserId
                )
        );
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<Page<FollowUserResponse>> getFollowers(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Long viewerUserId =
                currentUserService.getCurrentUserId(
                        authentication
                );

        return ResponseEntity.ok(
                followService.getFollowers(
                        id,
                        Math.max(page, 0),
                        Math.max(size, 1),
                        viewerUserId
                )
        );
    }
}