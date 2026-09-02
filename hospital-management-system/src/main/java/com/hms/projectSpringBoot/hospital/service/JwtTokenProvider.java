package com.hms.projectSpringBoot.hospital.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    // Creates the secret key used to sign and verify JWTs.

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );
    }


    // Generate JWT token after successful login.

    public String generateToken(
            Long userId,
            String username,
            String email,
            String role
    ) {

        Date now = new Date();

        Date expiration =
                new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()

                // Username
                .subject(username)

                // User ID
                .claim("id", userId)

                // Email
                .claim("email", email)

                // User role
                .claim("role", role)

                // Token creation time
                .issuedAt(now)

                // Token expiration
                .expiration(expiration)

                // Sign JWT
                .signWith(getSigningKey())

                // Convert to String
                .compact();
    }


    //Validate JWT token.

    public boolean validateToken(String token) {

        try {

            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception exception) {

            return false;
        }
    }

    /**
     * Extract username from JWT.
     */
    public String extractUsername(String token) {

        Claims claims = getClaims(token);

        return claims.getSubject();
    }

    /**
     * Extract user ID from JWT.
     */
    public Long extractUserId(String token) {

        Claims claims = getClaims(token);

        return claims.get("id", Long.class);
    }

    /**
     * Extract email from JWT.
     */
    public String extractEmail(String token) {

        Claims claims = getClaims(token);

        return claims.get("email", String.class);
    }

    /**
     * Extract role from JWT.
     */
    public String extractRole(String token) {

        Claims claims = getClaims(token);

        return claims.get("role", String.class);
    }

    /**
     * Extract all claims from JWT.
     */
    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Get configured token expiration time.
     */
    public long getTokenExpirationTime() {

        return jwtExpiration;
    }
}