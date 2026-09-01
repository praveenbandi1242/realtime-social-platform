package com.social.platform.repository;

import com.social.platform.entity.Comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository
        extends JpaRepository<Comment, Long> {

    Page<Comment> findByPostIdOrderByCreatedAtDesc(
            Long postId,
            Pageable pageable
    );

    long countByPostId(
            Long postId
    );
}