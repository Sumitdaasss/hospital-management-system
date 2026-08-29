package com.hms.projectSpringBoot.hospital.controller;

import com.hms.projectSpringBoot.hospital.dto.DoctorAvailabilityRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.DoctorAvailabilityResponseDTO;
import com.hms.projectSpringBoot.hospital.service.DoctorAvailabilityService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctor-availability")
@RequiredArgsConstructor
@Validated
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    @PostMapping("/doctor/{doctorId}")
    public ResponseEntity<DoctorAvailabilityResponseDTO> createAvailability(
            @PathVariable @Positive(message = "doctorId must be a positive number") Long doctorId,
            @Valid @RequestBody DoctorAvailabilityRequestDTO requestDTO) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        availabilityService.createAvailability(
                                doctorId,
                                requestDTO
                        )
                );
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorAvailabilityResponseDTO>>
    getDoctorAvailability(
            @PathVariable @Positive(message = "doctorId must be a positive number") Long doctorId) {

        return ResponseEntity.ok(
                availabilityService.getDoctorAvailability(doctorId)
        );
    }

    @GetMapping("/doctor/{doctorId}/date/{date}")
    public ResponseEntity<List<DoctorAvailabilityResponseDTO>>
    getDoctorAvailabilityByDate(
            @PathVariable @Positive(message = "doctorId must be a positive number") Long doctorId,
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                availabilityService.getDoctorAvailabilityByDate(
                        doctorId,
                        date
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorAvailabilityResponseDTO> updateAvailability(
            @PathVariable @Positive(message = "id must be a positive number") Long id,
            @Valid @RequestBody DoctorAvailabilityRequestDTO requestDTO) {

        return ResponseEntity.ok(
                availabilityService.updateAvailability(
                        id,
                        requestDTO
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAvailability(
            @PathVariable @Positive(message = "id must be a positive number") Long id) {

        availabilityService.deleteAvailability(id);

        return ResponseEntity.ok(
                "Doctor availability deleted successfully"
        );
    }
}

/*
Why date gets no extra annotation: Spring already converts the {date} path segment to LocalDate via its built-in formatter
 — if someone passes 2026-13-45, that conversion itself fails before your method even runs, throwing a
 TypeMismatchException/MethodArgumentTypeMismatchException (a different exception,
not one we've handled yet — flagged below).
 */