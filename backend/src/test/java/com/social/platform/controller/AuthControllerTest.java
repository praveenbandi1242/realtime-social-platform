package com.social.platform.controller;

import com.social.platform.dto.auth.LoginRequest;
import com.social.platform.dto.auth.RefreshTokenRequest;
import com.social.platform.dto.auth.RegisterRequest;
import com.social.platform.dto.user.AuthResponse;
import com.social.platform.service.AuthService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        authResponse = mock(AuthResponse.class);
    }

    @Test
    void register_shouldReturnCreated() {

        RegisterRequest request = mock(RegisterRequest.class);

        when(authService.register(request))
                .thenReturn(authResponse);

        ResponseEntity<AuthResponse> response =
                authController.register(request);

        assertEquals(
                HttpStatus.CREATED,
                response.getStatusCode()
        );

        assertSame(
                authResponse,
                response.getBody()
        );

        verify(authService).register(request);
    }

    @Test
    void login_shouldReturnOk() {

        LoginRequest request = mock(LoginRequest.class);

        when(authService.login(request))
                .thenReturn(authResponse);

        ResponseEntity<AuthResponse> response =
                authController.login(request);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                authResponse,
                response.getBody()
        );

        verify(authService).login(request);
    }

    @Test
    void refresh_shouldReturnOk() {

        RefreshTokenRequest request =
                mock(RefreshTokenRequest.class);

        when(authService.refreshToken(request))
                .thenReturn(authResponse);

        ResponseEntity<AuthResponse> response =
                authController.refresh(request);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                authResponse,
                response.getBody()
        );

        verify(authService).refreshToken(request);
    }

    @Test
    void logout_shouldReturnNoContent() {

        RefreshTokenRequest request =
                mock(RefreshTokenRequest.class);

        when(request.getRefreshToken())
                .thenReturn("refresh-token");

        ResponseEntity<Void> response =
                authController.logout(request);

        assertEquals(
                HttpStatus.NO_CONTENT,
                response.getStatusCode()
        );

        assertNull(response.getBody());

        verify(authService)
                .logout("refresh-token");
    }
}