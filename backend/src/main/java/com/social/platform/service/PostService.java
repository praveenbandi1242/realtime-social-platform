package com.social.platform.service;

import com.social.platform.dto.post.*;
import com.social.platform.entity.Post;
import com.social.platform.entity.PostLike;
import com.social.platform.entity.User;
import com.social.platform.exception.ResourceNotFoundException;
import com.social.platform.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostResponse createPost(
            Long userId,
            CreatePostRequest request
    ) {

        User user = getUser(userId);

        Post post = Post.builder()
                .user(user)
                .content(request.content().trim())
                .build();

        postRepository.save(post);

        return toResponse(
                post,
                userId
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getPosts(
            Long currentUserId,
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

        Page<Post> posts =
                postRepository
                        .findAllByOrderByCreatedAtDesc(
                                pageable
                        );

        return toPageResponse(
                posts,
                currentUserId
        );
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(
            Long postId,
            Long currentUserId
    ) {

        Post post = getPostEntity(postId);

        return toResponse(
                post,
                currentUserId
        );
    }

    @Transactional
    public PostResponse updatePost(
            Long postId,
            Long userId,
            UpdatePostRequest request
    ) {

        Post post = getPostEntity(postId);

        validateOwnership(
                post.getUser().getId(),
                userId
        );

        post.setContent(
                request.content().trim()
        );

        return toResponse(
                post,
                userId
        );
    }

    @Transactional
    public void deletePost(
            Long postId,
            Long userId
    ) {

        Post post = getPostEntity(postId);

        validateOwnership(
                post.getUser().getId(),
                userId
        );

        postRepository.delete(post);
    }

    @Transactional
    public void likePost(
            Long postId,
            Long userId
    ) {

        Post post = getPostEntity(postId);

        if (postLikeRepository
                .existsByPostIdAndUserId(
                        postId,
                        userId
                )) {

            return;
        }

        User user = getUser(userId);

        PostLike like =
                PostLike.builder()
                        .post(post)
                        .user(user)
                        .build();

        postLikeRepository.save(like);
    }

    @Transactional
    public void unlikePost(
            Long postId,
            Long userId
    ) {

        getPostEntity(postId);

        postLikeRepository
                .deleteByPostIdAndUserId(
                        postId,
                        userId
                );
    }

    private PostResponse toResponse(
            Post post,
            Long currentUserId
    ) {

        long likeCount =
                postLikeRepository
                        .countByPostId(post.getId());

        long commentCount =
                commentRepository
                        .countByPostId(post.getId());

        boolean liked =
                postLikeRepository
                        .existsByPostIdAndUserId(
                                post.getId(),
                                currentUserId
                        );

        User user = post.getUser();

        return new PostResponse(
                post.getId(),
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                post.getContent(),
                likeCount,
                commentCount,
                liked,
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private PageResponse<PostResponse> toPageResponse(
            Page<Post> page,
            Long currentUserId
    ) {

        return new PageResponse<>(
                page.getContent()
                        .stream()
                        .map(post ->
                                toResponse(
                                        post,
                                        currentUserId
                                )
                        )
                        .toList(),

                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }

    private Post getPostEntity(Long id) {

        return postRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Post not found"
                        )
                );
    }

    private User getUser(Long id) {

        return userRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    private void validateOwnership(
            Long ownerId,
            Long currentUserId
    ) {

        if (!ownerId.equals(currentUserId)) {

            throw new com.social.platform.exception.UnauthorizedException(
                    "You are not allowed to modify this resource"
            );
        }
    }
}