package com.hms.projectSpringBoot.hospital.mapper;

import com.hms.projectSpringBoot.hospital.dto.AppointmentRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.AppointmentResponseDTO;
import com.hms.projectSpringBoot.hospital.entity.Appointment;
import com.hms.projectSpringBoot.hospital.entity.AppointmentStatus;
import com.hms.projectSpringBoot.hospital.entity.Doctor;
import com.hms.projectSpringBoot.hospital.entity.Patient;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class AppointmentMapper {

    // DTO + resolved Patient/Doctor entities -> new appointment entity.
    // patient/doctor are passed in separately because the service must
    // look them up (and validate them) before an entity can be built -
    // the mapper itself never touches a repository.
    public Appointment toEntity(
            AppointmentRequestDTO dto, Patient patient, Doctor doctor) {

        return Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(dto.getAppointmentDate())
                .appointmentTime(dto.getAppointmentTime())
                .problem(dto.getProblem())
                .status(AppointmentStatus.BOOKED)
                .createdAt(LocalDate.now())
                .build();
    }

    // entity from DB -> DTO going out to the client
    public AppointmentResponseDTO toResponseDTO(Appointment appointment) {

        return AppointmentResponseDTO.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getName())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getName())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .problem(appointment.getProblem())
                .status(appointment.getStatus())
                .createdAt(appointment.getCreatedAt())
                .build();
    }
}