package com.social.platform.dto.user;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchResponse {

    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String profileImageUrl;
}