package com.social.platform.repository;

import com.social.platform.entity.Post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository
        extends JpaRepository<Post, Long> {

    Page<Post> findAllByOrderByCreatedAtDesc(
            Pageable pageable
    );

    Page<Post> findByUserIdOrderByCreatedAtDesc(
            Long userId,
            Pageable pageable
    );
}