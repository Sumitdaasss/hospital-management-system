package com.hms.projectSpringBoot.hospital.mapper;

import com.hms.projectSpringBoot.hospital.dto.PatientRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.PatientResponseDTO;
import com.hms.projectSpringBoot.hospital.entity.Patient;
import org.springframework.stereotype.Component;

@Component
public class PatientMapper {

    // DTO coming in from the client -> new entity (no id, JPA will generate it)
    public Patient toEntity(PatientRequestDTO dto) {

        return Patient.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .address(dto.getAddress())
                .bloodGroup(dto.getBloodGroup())
                .healthProblem(dto.getHealthProblem())
                .build();
    }

    // entity from DB -> DTO going out to the client
    public PatientResponseDTO toResponseDTO(Patient patient) {

        return PatientResponseDTO.builder()
                .id(patient.getId())
                .name(patient.getName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .address(patient.getAddress())
                .bloodGroup(patient.getBloodGroup())
                .healthProblem(patient.getHealthProblem())
                .build();
    }

    // apply an update DTO onto an existing managed entity (no new object, keeps the id)
    public void updateEntityFromDto(PatientRequestDTO dto, Patient existingPatient) {

        existingPatient.setName(dto.getName());
        existingPatient.setEmail(dto.getEmail());
        existingPatient.setPhone(dto.getPhone());
        existingPatient.setDateOfBirth(dto.getDateOfBirth());
        existingPatient.setGender(dto.getGender());
        existingPatient.setAddress(dto.getAddress());
        existingPatient.setBloodGroup(dto.getBloodGroup());
        existingPatient.setHealthProblem(dto.getHealthProblem());
    }
}