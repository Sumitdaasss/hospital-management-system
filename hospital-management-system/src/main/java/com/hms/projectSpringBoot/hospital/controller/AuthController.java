package com.hms.projectSpringBoot.hospital.controller;

import com.hms.projectSpringBoot.hospital.dto.LoginRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.LoginResponseDTO;
import com.hms.projectSpringBoot.hospital.dto.RegisterRequestDTO;
import com.hms.projectSpringBoot.hospital.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO requestDTO
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        authService.register(requestDTO)
                );
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO requestDTO
    ) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                        authService.login(requestDTO)
                );
    }
}