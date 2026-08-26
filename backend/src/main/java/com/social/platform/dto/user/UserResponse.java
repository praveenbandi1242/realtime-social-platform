package com.social.platform.dto.user;

import com.social.platform.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private String profileImageUrl;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdAt;
}