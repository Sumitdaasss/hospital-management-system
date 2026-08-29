/*
What actually changed vs. your original controller: every Patient in the method signatures became PatientRequestDTO/PatientResponseDTO,
and @Valid was added in front of @RequestBody on create/update — that's what makes your MethodArgumentNotValidException handler in GlobalExceptionHandler fire when someone submits a blank name or bad email.

Everything else — routes, HTTP methods, status codes — is identical, so nothing about how the API is called changes,
only what shape of JSON goes in and out.
 */
package com.hms.projectSpringBoot.hospital.controller;

import com.hms.projectSpringBoot.hospital.dto.PatientRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.PatientResponseDTO;
import com.hms.projectSpringBoot.hospital.service.PatientService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@Validated
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public ResponseEntity<PatientResponseDTO> createPatient(
            @Valid @RequestBody PatientRequestDTO requestDTO) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(patientService.createPatient(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<PatientResponseDTO>> getAllPatients() {

        return ResponseEntity.ok(
                patientService.getAllPatients()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> getPatientById(
            @PathVariable @Positive(message = "id must be a positive number") Long id) {

        return ResponseEntity.ok(
                patientService.getPatientById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> updatePatient(
            @PathVariable @Positive(message = "id must be a positive number") Long id,
            @Valid @RequestBody PatientRequestDTO requestDTO) {

        return ResponseEntity.ok(
                patientService.updatePatient(id, requestDTO)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(
            @PathVariable @Positive(message = "id must be a positive number") Long id) {

        patientService.deletePatient(id);

        return ResponseEntity.ok(
                "Patient deleted successfully"
        );
    }
}