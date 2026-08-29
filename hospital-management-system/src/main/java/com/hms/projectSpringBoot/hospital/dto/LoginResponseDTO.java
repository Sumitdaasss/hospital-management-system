package com.hms.projectSpringBoot.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private Long userId;

    private String username;

    private String email;

    private String role;

    private String token;

    private String tokenType;

    // Token expiration time in milliseconds
    private Long expiresIn;
}