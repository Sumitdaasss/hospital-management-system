package com.hms.projectSpringBoot.hospital.controller;

import com.hms.projectSpringBoot.hospital.dto.DoctorRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.DoctorResponseDTO;
import com.hms.projectSpringBoot.hospital.service.DoctorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Validated   // <-- required for @PathVariable/@RequestParam validation to trigger
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<DoctorResponseDTO> createDoctor(
            @Valid @RequestBody DoctorRequestDTO doctorRequestDTO) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(doctorService.createDoctor(doctorRequestDTO));
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponseDTO>> getAllDoctors() {

        return ResponseEntity.ok(
                doctorService.getAllDoctors()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponseDTO> getDoctorById(
            @PathVariable @Positive(message = "id must be a positive number") Long id) {

        return ResponseEntity.ok(
                doctorService.getDoctorById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorResponseDTO> updateDoctor(
            @PathVariable @Positive(message = "id must be a positive number") Long id,
            @Valid @RequestBody DoctorRequestDTO requestDTO) {

        return ResponseEntity.ok(
                doctorService.updateDoctor(id, requestDTO)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(
            @PathVariable @Positive(message = "id must be a positive number") Long id) {

        doctorService.deleteDoctor(id);

        return ResponseEntity.ok(
                "Doctor deleted successfully"
        );
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<DoctorResponseDTO>> getDoctorsBySpecialization(
            @PathVariable @NotBlank(message = "specialization must not be blank") String specialization) {

        return ResponseEntity.ok(
                doctorService.getDoctorsBySpecialization(specialization)
        );
    }

    @GetMapping("/available")
    public ResponseEntity<List<DoctorResponseDTO>> getAvailableDoctors() {

        return ResponseEntity.ok(
                doctorService.getAvailableDoctors()
        );
    }

    @GetMapping("/available/specialization/{specialization}")
    public ResponseEntity<List<DoctorResponseDTO>>
    getAvailableDoctorsBySpecialization(
            @PathVariable @NotBlank(message = "specialization must not be blank") String specialization) {

        return ResponseEntity.ok(
                doctorService
                        .getAvailableDoctorsBySpecialization(specialization)
        );
    }
}
/*
Same pattern as Patient: signatures swapped to DTOs, @Valid added on the two write endpoints, routes/status codes unchanged.

One thing to flag before we go further: DoctorRepository needs an existsByEmail(String email) method for the duplicate check above — check if it's already there; if not, it's a one-line addition (boolean existsByEmail(String email);) alongside your existing findBySpecializationIgnoreCase methods.
 */

// validation :
/*
What changed:

@Validated added at the class level — this is what tells Spring to actually check constraint annotations on method parameters (not just @RequestBody).
@Positive on every id path variable — rejects 0 or negative numbers before they ever reach the service.
@NotBlank on specialization — rejects empty/whitespace-only values.
 */