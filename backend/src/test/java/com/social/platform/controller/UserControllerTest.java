package com.social.platform.controller;

import com.social.platform.dto.user.*;
import com.social.platform.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserController userController;

    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        userResponse = mock(UserResponse.class);
    }

    @Test
    void getCurrentUser_shouldReturnOk() {

        when(authentication.getName())
                .thenReturn("praveen@gmail.com");

        when(userService.getCurrentUser(
                "praveen@gmail.com"
        )).thenReturn(userResponse);

        ResponseEntity<UserResponse> response =
                userController.getCurrentUser(authentication);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                userResponse,
                response.getBody()
        );

        verify(userService)
                .getCurrentUser("praveen@gmail.com");
    }

    @Test
    void updateProfile_shouldReturnOk() {

        when(authentication.getName())
                .thenReturn("praveen@gmail.com");

        UpdateProfileRequest request =
                mock(UpdateProfileRequest.class);

        when(userService.updateProfile(
                "praveen@gmail.com",
                request
        )).thenReturn(userResponse);

        ResponseEntity<UserResponse> response =
                userController.updateProfile(
                        authentication,
                        request
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                userResponse,
                response.getBody()
        );

        verify(userService)
                .updateProfile(
                        "praveen@gmail.com",
                        request
                );
    }

    @Test
    void changePassword_shouldReturnNoContent() {

        when(authentication.getName())
                .thenReturn("praveen@gmail.com");

        ChangePasswordRequest request =
                mock(ChangePasswordRequest.class);

        ResponseEntity<Void> response =
                userController.changePassword(
                        authentication,
                        request
                );

        assertEquals(
                HttpStatus.NO_CONTENT,
                response.getStatusCode()
        );

        assertNull(response.getBody());

        verify(userService)
                .changePassword(
                        "praveen@gmail.com",
                        request
                );
    }

    @Test
    void deactivateAccount_shouldReturnNoContent() {

        when(authentication.getName())
                .thenReturn("praveen@gmail.com");

        ResponseEntity<Void> response =
                userController.deactivateAccount(
                        authentication
                );

        assertEquals(
                HttpStatus.NO_CONTENT,
                response.getStatusCode()
        );

        assertNull(response.getBody());

        verify(userService)
                .deactivateAccount(
                        "praveen@gmail.com"
                );
    }

    @Test
    void searchUsers_shouldReturnOk() {

        Page<UserSearchResponse> page =
                mock(Page.class);

        when(userService.searchUsers(
                eq("praveen"),
                any()
        )).thenReturn(page);

        ResponseEntity<Page<UserSearchResponse>> response =
                userController.searchUsers(
                        "praveen",
                        0,
                        10
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                page,
                response.getBody()
        );

        verify(userService)
                .searchUsers(
                        eq("praveen"),
                        any()
                );
    }
}