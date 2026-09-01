package com.social.platform.config;

import com.social.platform.security.CustomUserDetailsService;
import com.social.platform.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.context.properties.EnableConfigurationProperties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableMethodSecurity
@EnableConfigurationProperties(JwtProperties.class)
@RequiredArgsConstructor
public class SecurityConfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    private final CustomUserDetailsService userDetailsService;


    /* =========================================================
       PASSWORD ENCODER
    ========================================================= */

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    /* =========================================================
       AUTHENTICATION PROVIDER
    ========================================================= */

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        userDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder()
        );

        return provider;
    }


    /* =========================================================
       AUTHENTICATION MANAGER
    ========================================================= */

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }


    /* =========================================================
       SECURITY FILTER CHAIN
    ========================================================= */

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                /*
                 * REST API uses JWT.
                 * CSRF is therefore disabled.
                 */
                .csrf(csrf ->
                        csrf.disable()
                )


                /*
                 * Allow configured CORS requests.
                 */
                .cors(cors -> {
                })


                /*
                 * No HTTP session.
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                /* =================================================
                   AUTHORIZATION
                ================================================= */

                .authorizeHttpRequests(auth -> auth

                        /*
                         * Public authentication endpoints.
                         */
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        /*
                         * Health endpoint.
                         */
                        .requestMatchers(
                                "/actuator/health"
                        ).permitAll()


                        /*
                         * IMPORTANT:
                         *
                         * Allow the WebSocket handshake.
                         *
                         * The actual JWT authentication happens
                         * inside JwtStompInterceptor during STOMP
                         * CONNECT.
                         */
                        .requestMatchers(
                                "/ws",
                                "/ws/**"
                        ).permitAll()


                        /*
                         * Admin APIs.
                         */
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")


                        /*
                         * Everything else requires authentication.
                         */
                        .anyRequest()
                        .authenticated()
                )


                /*
                 * Authentication provider.
                 */
                .authenticationProvider(
                        authenticationProvider()
                )


                /*
                 * JWT filter for normal REST API requests.
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}