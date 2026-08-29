package com.hms.projectSpringBoot.hospital.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UserResponseDTO {

    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private Boolean isActive;
}
