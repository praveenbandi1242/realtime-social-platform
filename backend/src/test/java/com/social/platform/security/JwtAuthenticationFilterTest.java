package com.social.platform.security;

import jakarta.servlet.FilterChain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private FilterChain filterChain;

    @Mock
    private UserDetails userDetails;

    private JwtAuthenticationFilter filter;

    private MockHttpServletRequest request;

    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {

        filter = new JwtAuthenticationFilter(
                jwtService,
                userDetailsService
        );

        request = new MockHttpServletRequest();

        response = new MockHttpServletResponse();

        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldContinueWhenAuthorizationHeaderMissing()
            throws Exception {

        filter.doFilter(
                request,
                response,
                filterChain
        );

        verify(filterChain)
                .doFilter(request, response);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }

    @Test
    void shouldContinueWhenAuthorizationHeaderIsNotBearer()
            throws Exception {

        request.addHeader(
                "Authorization",
                "Basic abc"
        );

        filter.doFilter(
                request,
                response,
                filterChain
        );

        verify(filterChain)
                .doFilter(request, response);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }

    @Test
    void shouldContinueWhenTokenIsInvalid()
            throws Exception {

        request.addHeader(
                "Authorization",
                "Bearer invalid-token"
        );

        when(jwtService.extractUsername(
                "invalid-token"
        )).thenThrow(
                new RuntimeException("Invalid JWT")
        );

        filter.doFilter(
                request,
                response,
                filterChain
        );

        verify(filterChain)
                .doFilter(request, response);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }

    @Test
    void shouldAuthenticateWhenTokenIsValid()
            throws Exception {

        String token = "valid-token";

        request.addHeader(
                "Authorization",
                "Bearer " + token
        );

        when(jwtService.extractUsername(token))
                .thenReturn("praveen@gmail.com");

        when(userDetailsService.loadUserByUsername(
                "praveen@gmail.com"
        )).thenReturn(userDetails);

        when(jwtService.isTokenValid(
                token,
                userDetails
        )).thenReturn(true);

        when(userDetails.getAuthorities())
                .thenReturn(java.util.Collections.emptyList());

        filter.doFilter(
                request,
                response,
                filterChain
        );

        verify(userDetailsService)
                .loadUserByUsername(
                        "praveen@gmail.com"
                );

        verify(jwtService)
                .isTokenValid(
                        token,
                        userDetails
                );

        verify(filterChain)
                .doFilter(request, response);

        assertNotNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );

        assertEquals(
                userDetails,
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal()
        );
    }

    @Test
    void shouldNotAuthenticateWhenTokenValidationFails()
            throws Exception {

        String token = "invalid-valid-format-token";

        request.addHeader(
                "Authorization",
                "Bearer " + token
        );

        when(jwtService.extractUsername(token))
                .thenReturn("praveen@gmail.com");

        when(userDetailsService.loadUserByUsername(
                "praveen@gmail.com"
        )).thenReturn(userDetails);

        when(jwtService.isTokenValid(
                token,
                userDetails
        )).thenReturn(false);

        filter.doFilter(
                request,
                response,
                filterChain
        );

        verify(filterChain)
                .doFilter(request, response);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }
}