package com.hms.projectSpringBoot.hospital.config;

import com.hms.projectSpringBoot.hospital.service.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {

            // Get JWT token from request
            String token = getTokenFromRequest(request);

            // Check if token exists and is valid
            if (StringUtils.hasText(token)
                    && jwtTokenProvider.validateToken(token)) {

                // Get username from JWT
                String username =
                        jwtTokenProvider.extractUsername(token);

                // Get role from JWT
                String role =
                        jwtTokenProvider.extractRole(token);

                /*
                 * Spring Security expects:
                 *
                 * ROLE_ADMIN
                 * ROLE_DOCTOR
                 * ROLE_PATIENT
                 */
                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        );

                // Create authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(authority)
                        );

                // Store authentication in SecurityContext
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception e) {

            // Invalid token
            SecurityContextHolder
                    .clearContext();
        }

        // Continue request
        filterChain.doFilter(request, response);
    }


    // =========================================================
    // GET JWT TOKEN FROM REQUEST
    // =========================================================

    private String getTokenFromRequest(
            HttpServletRequest request
    ) {

        String bearerToken =
                request.getHeader("Authorization");

        /*
         * Expected:
         *
         * Authorization: Bearer eyJhbGciOi...
         */

        if (StringUtils.hasText(bearerToken)
                && bearerToken.startsWith("Bearer ")) {

            return bearerToken.substring(7);
        }

        return null;
    }
}