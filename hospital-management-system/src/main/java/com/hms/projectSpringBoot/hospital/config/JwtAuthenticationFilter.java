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

            // 1. Get JWT from Authorization header
            String token = getTokenFromRequest(request);

            // 2. Check whether token exists and is valid
            if (StringUtils.hasText(token)
                    && jwtTokenProvider.validateToken(token)) {

                // 3. Get username from JWT
                String username =
                        jwtTokenProvider.extractUsername(token);

                // 4. Get role from JWT
                String role =
                        jwtTokenProvider.extractRole(token);

                // 5. Convert role into Spring Security authority
                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        );

                // 6. Create authenticated user
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(authority)
                        );

                // 7. Store authentication in SecurityContext
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception exception) {

            // Invalid JWT
            SecurityContextHolder.clearContext();
        }

        // Continue request
        filterChain.doFilter(request, response);
    }

    /**
     * Gets JWT from:
     *
     * Authorization: Bearer <token>
     */
    private String getTokenFromRequest(
            HttpServletRequest request
    ) {

        String authorizationHeader =
                request.getHeader("Authorization");

        if (StringUtils.hasText(authorizationHeader)
                && authorizationHeader.startsWith("Bearer ")) {

            return authorizationHeader.substring(7);
        }

        return null;
    }
}