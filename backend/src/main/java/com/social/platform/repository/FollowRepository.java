package com.social.platform.repository;

import com.social.platform.entity.Follow;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository
        extends JpaRepository<Follow, Long> {

    boolean existsByFollowerIdAndFollowingId(
            Long followerId,
            Long followingId
    );

    void deleteByFollowerIdAndFollowingId(
            Long followerId,
            Long followingId
    );

    Page<Follow> findByFollowingIdOrderByCreatedAtDesc(
            Long followingId,
            Pageable pageable
    );

    Page<Follow> findByFollowerIdOrderByCreatedAtDesc(
            Long followerId,
            Pageable pageable
    );

    long countByFollowingId(
            Long followingId
    );

    long countByFollowerId(
            Long followerId
    );
}