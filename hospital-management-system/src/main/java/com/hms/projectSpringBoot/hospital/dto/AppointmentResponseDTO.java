package com.hms.projectSpringBoot.hospital.dto;

import com.hms.projectSpringBoot.hospital.entity.AppointmentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class AppointmentResponseDTO {

    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String problem;
    private AppointmentStatus status;
    private LocalDate createdAt;
}

/*
Why this one matters most: this replaces your current bookAppointment controller method,
which takes five separate @RequestParams in the URL. AppointmentRequestDTO lets the client send one clean JSON body instead, and
@Valid on the controller parameter triggers your new MethodArgumentNotValidException handler automatically.
 */