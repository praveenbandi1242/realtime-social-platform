package com.social.platform.controller;

import com.social.platform.dto.post.*;
import com.social.platform.security.CurrentUserService;
import com.social.platform.security.CustomUserDetailsService;
import com.social.platform.service.PostService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            Authentication authentication,
            @Valid @RequestBody CreatePostRequest request
    ) {

        Long userId =
                currentUserService.getCurrentUserId(authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        postService.createPost(
                                userId,
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<PageResponse<PostResponse>> getPosts(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Long userId =
                currentUserService.getCurrentUserId(authentication);

        return ResponseEntity.ok(
                postService.getPosts(
                        userId,
                        Math.max(page, 0),
                        Math.max(size, 1)
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(
            Authentication authentication,
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                postService.getPost(
                        id,
                        currentUserService.getCurrentUserId(authentication)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request
    ) {

        return ResponseEntity.ok(
                postService.updatePost(
                        id,
                        currentUserService.getCurrentUserId(authentication),
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            Authentication authentication,
            @PathVariable Long id
    ) {

        postService.deletePost(
                id,
                currentUserService.getCurrentUserId(authentication)
        );

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(
            Authentication authentication,
            @PathVariable Long id
    ) {

        postService.likePost(
                id,
                currentUserService.getCurrentUserId(authentication)
        );

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikePost(
            Authentication authentication,
            @PathVariable Long id
    ) {

        postService.unlikePost(
                id,
                currentUserService.getCurrentUserId(authentication)
        );

        return ResponseEntity.noContent().build();
    }
}