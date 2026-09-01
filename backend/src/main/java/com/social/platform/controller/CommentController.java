package com.social.platform.controller;

import com.social.platform.dto.comment.*;
import com.social.platform.dto.post.PageResponse;
import com.social.platform.security.CurrentUserService;
import com.social.platform.service.CommentService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CurrentUserService currentUserService;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            Authentication authentication,
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        commentService.createComment(
                                postId,
                                currentUserService.getCurrentUserId(authentication),
                                request
                        )
                );
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<PageResponse<CommentResponse>> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {

        return ResponseEntity.ok(
                commentService.getComments(
                        postId,
                        Math.max(page, 0),
                        Math.max(size, 1)
                )
        );
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommentRequest request
    ) {

        return ResponseEntity.ok(
                commentService.updateComment(
                        id,
                        currentUserService.getCurrentUserId(authentication),
                        request
                )
        );
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            Authentication authentication,
            @PathVariable Long id
    ) {

        commentService.deleteComment(
                id,
                currentUserService.getCurrentUserId(authentication)
        );

        return ResponseEntity.noContent().build();
    }

}