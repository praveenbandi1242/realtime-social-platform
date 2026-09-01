package com.social.platform.service;

import com.social.platform.dto.user.*;
import com.social.platform.entity.User;
import com.social.platform.exception.BadRequestException;
import com.social.platform.exception.ResourceNotFoundException;
import com.social.platform.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {

        User user = findByEmail(email);

        return toResponse(user);
    }

    /*
     * Get a user's profile by ID.
     *
     * This is used when:
     *
     * Search
     *   ↓
     * click user
     *   ↓
     * /users/{id}
     *   ↓
     * GET /api/users/{id}
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {

        User user = findById(userId);

        return toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(
            String email,
            UpdateProfileRequest request) {

        User user = findByEmail(email);

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setBio(request.getBio());
        user.setProfileImageUrl(
                request.getProfileImageUrl()
        );

        return toResponse(
                userRepository.save(user)
        );
    }

    @Transactional
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        User user = findByEmail(email);

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new BadRequestException(
                    "Current password is incorrect"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

    @Transactional
    public void deactivateAccount(String email) {

        User user = findByEmail(email);

        user.setEnabled(false);

        userRepository.save(user);
    }

    @Transactional
    public void activateAccount(Long userId) {

        User user = findById(userId);

        user.setEnabled(true);

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Page<UserSearchResponse> searchUsers(
            String query,
            Pageable pageable) {

        return userRepository
                .findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        query,
                        query,
                        query,
                        pageable
                )
                .map(this::toSearchResponse);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {

        return userRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }

    private UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private UserSearchResponse toSearchResponse(User user) {

        return UserSearchResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}