package com.social.platform.service;

import com.social.platform.dto.comment.*;
import com.social.platform.dto.post.PageResponse;
import com.social.platform.entity.Comment;
import com.social.platform.entity.Post;
import com.social.platform.entity.User;
import com.social.platform.exception.ResourceNotFoundException;
import com.social.platform.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponse createComment(
            Long postId,
            Long userId,
            CreateCommentRequest request
    ) {

        Post post =
                postRepository.findById(postId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Post not found"
                                )
                        );

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        Comment comment =
                Comment.builder()
                        .post(post)
                        .user(user)
                        .content(
                                request.content().trim()
                        )
                        .build();

        commentRepository.save(comment);

        return toResponse(comment);
    }

    @Transactional(readOnly = true)
    public PageResponse<CommentResponse> getComments(
            Long postId,
            int page,
            int size
    ) {

        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException(
                    "Post not found"
            );
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        Math.min(size, 50),
                        Sort.by(
                                Sort.Direction.DESC,
                                "createdAt"
                        )
                );

        Page<Comment> comments =
                commentRepository
                        .findByPostIdOrderByCreatedAtDesc(
                                postId,
                                pageable
                        );

        return new PageResponse<>(
                comments.getContent()
                        .stream()
                        .map(this::toResponse)
                        .toList(),

                comments.getNumber(),
                comments.getSize(),
                comments.getTotalElements(),
                comments.getTotalPages(),
                comments.isFirst(),
                comments.isLast()
        );
    }

    @Transactional
    public CommentResponse updateComment(
            Long commentId,
            Long userId,
            UpdateCommentRequest request
    ) {

        Comment comment =
                getComment(commentId);

        validateOwnership(
                comment.getUser().getId(),
                userId
        );

        comment.setContent(
                request.content().trim()
        );

        return toResponse(comment);
    }

    @Transactional
    public void deleteComment(
            Long commentId,
            Long userId
    ) {

        Comment comment =
                getComment(commentId);

        validateOwnership(
                comment.getUser().getId(),
                userId
        );

        commentRepository.delete(comment);
    }

    private Comment getComment(Long id) {

        return commentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Comment not found"
                        )
                );
    }

    private void validateOwnership(
            Long ownerId,
            Long userId
    ) {

        if (!ownerId.equals(userId)) {

            throw new com.social.platform.exception.UnauthorizedException(
                    "You are not allowed to modify this comment"
            );
        }
    }

    private CommentResponse toResponse(
            Comment comment
    ) {

        User user = comment.getUser();

        return new CommentResponse(
                comment.getId(),
                comment.getPost().getId(),
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}