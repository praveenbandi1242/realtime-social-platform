package com.social.platform.dto.follow;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FollowUserResponse {

    private Long id;

    private String username;

    private String firstName;

    private String lastName;

    /*
     * Whether the currently authenticated user follows
     * this user.
     *
     * This is NOT:
     *
     * "Does this user have followers?"
     *
     * It specifically represents:
     *
     * current authenticated user
     *          ↓
     *       follows
     *          ↓
     *       this user
     */
    private boolean following;

    private String profileImageUrl;
}