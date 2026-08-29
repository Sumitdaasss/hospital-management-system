package com.hms.projectSpringBoot.hospital.service;

import com.hms.projectSpringBoot.hospital.dto.LoginRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.LoginResponseDTO;
import com.hms.projectSpringBoot.hospital.dto.RegisterRequestDTO;
import com.hms.projectSpringBoot.hospital.entity.Role;
import com.hms.projectSpringBoot.hospital.entity.User;
import com.hms.projectSpringBoot.hospital.exception.InvalidRequestException;
import com.hms.projectSpringBoot.hospital.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtTokenProvider jwtTokenProvider;


    // =========================================================
    // REGISTER
    // =========================================================

    public LoginResponseDTO register(
            RegisterRequestDTO requestDTO
    ) {

        // Check username
        if (userRepository.existsByUsername(
                requestDTO.getUsername())) {

            throw new InvalidRequestException(
                    "Username already exists"
            );
        }


        // Check email
        if (userRepository.existsByEmail(
                requestDTO.getEmail())) {

            throw new InvalidRequestException(
                    "Email already exists"
            );
        }


        // Check passwords
        if (!requestDTO.getPassword()
                .equals(requestDTO.getConfirmPassword())) {

            throw new InvalidRequestException(
                    "Passwords do not match"
            );
        }


        /*
         * Public registration always creates PATIENT.
         *
         * This prevents someone from registering themselves
         * as ADMIN.
         */
        User user = User.builder()

                .username(requestDTO.getUsername())

                .email(requestDTO.getEmail())

                .password(
                        passwordEncoder.encode(
                                requestDTO.getPassword()
                        )
                )

                .role(Role.PATIENT)

                .createdAt(LocalDateTime.now())

                .build();


        User savedUser =
                userRepository.save(user);


        return buildLoginResponse(savedUser);
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public LoginResponseDTO login(
            LoginRequestDTO requestDTO
    ) {

        User user =
                userRepository
                        .findByUsername(
                                requestDTO.getUsername()
                        )
                        .orElseThrow(
                                () -> new InvalidRequestException(
                                        "Invalid username or password"
                                )
                        );


        // Check password
        if (!passwordEncoder.matches(
                requestDTO.getPassword(),
                user.getPassword()
        )) {

            throw new InvalidRequestException(
                    "Invalid username or password"
            );
        }


        return buildLoginResponse(user);
    }


    // =========================================================
    // BUILD LOGIN RESPONSE
    // =========================================================

    private LoginResponseDTO buildLoginResponse(
            User user
    ) {

        String token =
                jwtTokenProvider.generateToken(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().name()
                );


        long expiresIn =
                jwtTokenProvider.getTokenExpirationTime();


        return LoginResponseDTO.builder()

                .userId(user.getId())

                .username(user.getUsername())

                .email(user.getEmail())

                .role(user.getRole().name())

                .token(token)

                .tokenType("Bearer")

                .expiresIn(expiresIn)

                .build();
    }
}