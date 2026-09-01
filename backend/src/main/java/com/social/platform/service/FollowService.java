package com.social.platform.service;

import com.social.platform.dto.follow.FollowUserResponse;
import com.social.platform.entity.Follow;
import com.social.platform.entity.NotificationType;
import com.social.platform.entity.User;
import com.social.platform.exception.BadRequestException;
import com.social.platform.exception.ResourceNotFoundException;
import com.social.platform.repository.FollowRepository;
import com.social.platform.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public void follow(
            Long currentUserId,
            Long targetUserId
    ) {

        if (currentUserId.equals(targetUserId)) {
            throw new BadRequestException(
                    "You cannot follow yourself"
            );
        }

        User follower = getUser(currentUserId);
        User following = getUser(targetUserId);

        if (followRepository.existsByFollowerIdAndFollowingId(
                currentUserId,
                targetUserId
        )) {
            return;
        }

        Follow follow =
                Follow.builder()
                        .follower(follower)
                        .following(following)
                        .build();

        followRepository.save(follow);

        notificationService.createNotification(
                targetUserId,
                currentUserId,
                NotificationType.FOLLOW,
                follower.getUsername()
                        + " started following you",
                null
        );
    }

    @Transactional
    public void unfollow(
            Long currentUserId,
            Long targetUserId
    ) {

        getUser(targetUserId);

        followRepository.deleteByFollowerIdAndFollowingId(
                currentUserId,
                targetUserId
        );
    }

    /*
     * Get people this user follows.
     *
     * viewerUserId tells us who is looking at the list.
     *
     * Example:
     *
     * Praveen opens John's profile.
     *
     * userId       = John
     * viewerUserId = Praveen
     *
     * For every person John follows, we calculate:
     *
     * Does Praveen follow that person?
     */
    @Transactional(readOnly = true)
    public Page<FollowUserResponse> getFollowing(
            Long userId,
            int page,
            int size,
            Long viewerUserId
    ) {

        getUser(userId);
        getUser(viewerUserId);

        Pageable pageable =
                PageRequest.of(page, size);

        return followRepository
                .findByFollowerIdOrderByCreatedAtDesc(
                        userId,
                        pageable
                )
                .map(follow ->
                        toUserResponse(
                                follow.getFollowing(),
                                viewerUserId
                        )
                );
    }

    /*
     * Get people following this user.
     *
     * viewerUserId tells us who is looking at the list.
     *
     * Example:
     *
     * Praveen opens John's profile.
     *
     * userId       = John
     * viewerUserId = Praveen
     *
     * For every follower of John, we calculate:
     *
     * Does Praveen also follow that person?
     */
    @Transactional(readOnly = true)
    public Page<FollowUserResponse> getFollowers(
            Long userId,
            int page,
            int size,
            Long viewerUserId
    ) {

        getUser(userId);
        getUser(viewerUserId);

        Pageable pageable =
                PageRequest.of(page, size);

        return followRepository
                .findByFollowingIdOrderByCreatedAtDesc(
                        userId,
                        pageable
                )
                .map(follow ->
                        toUserResponse(
                                follow.getFollower(),
                                viewerUserId
                        )
                );
    }

    /*
     * Convert a User into the response expected by the frontend.
     *
     * The important part is calculating `following`.
     *
     * Example:
     *
     * viewer = Praveen
     * target = Rahul
     *
     * following = true
     *
     * means:
     *
     * Praveen -> Rahul
     */
    private FollowUserResponse toUserResponse(
            User user,
            Long viewerUserId
    ) {

        boolean following =
                followRepository
                        .existsByFollowerIdAndFollowingId(
                                viewerUserId,
                                user.getId()
                        );

        return FollowUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .following(following)
                .profileImageUrl(
                        user.getProfileImageUrl()
                )
                .build();
    }

    private User getUser(Long id) {

        return userRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }
}