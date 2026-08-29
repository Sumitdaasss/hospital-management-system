package com.hms.projectSpringBoot.hospital.controller;

import com.hms.projectSpringBoot.hospital.dto.AppointmentRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.AppointmentResponseDTO;
import com.hms.projectSpringBoot.hospital.entity.AppointmentStatus;
import com.hms.projectSpringBoot.hospital.service.AppointmentService;
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
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Validated
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> bookAppointment(
            @Valid @RequestBody AppointmentRequestDTO AppointmentrequestDTO) {

        AppointmentResponseDTO appointment =
                appointmentService.bookAppointment(AppointmentrequestDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(appointment);
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponseDTO>> getAllAppointments() {

        return ResponseEntity.ok(
                appointmentService.getAllAppointments()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> getAppointmentById(
            @PathVariable @Positive(message = "id must be a positive number") Long id) {

        return ResponseEntity.ok(
                appointmentService.getAppointmentById(id)
        );
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponseDTO>> getPatientAppointments(
            @PathVariable @Positive(message = "patientId must be a positive number") Long patientId) {

        return ResponseEntity.ok(
                appointmentService.getPatientAppointments(patientId)
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponseDTO>> getDoctorAppointments(
            @PathVariable @Positive(message = "doctorId must be a positive number") Long doctorId) {

        return ResponseEntity.ok(
                appointmentService.getDoctorAppointments(doctorId)
        );
    }

    @GetMapping("/doctor/{doctorId}/date/{date}")
    public ResponseEntity<List<AppointmentResponseDTO>> getDoctorAppointmentsByDate(
            @PathVariable @Positive(message = "doctorId must be a positive number") Long doctorId,
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                appointmentService.getDoctorAppointmentsByDate(
                        doctorId,
                        date
                )
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentResponseDTO> updateAppointmentStatus(
            @PathVariable @Positive(message = "id must be a positive number") Long id,
            @RequestParam AppointmentStatus status) {

        return ResponseEntity.ok(
                appointmentService.updateAppointmentStatus(
                        id,
                        status
                )
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponseDTO> cancelAppointment(
            @PathVariable @Positive(message = "id must be a positive number") Long id) {

        return ResponseEntity.ok(
                appointmentService.cancelAppointment(id)
        );
    }
}