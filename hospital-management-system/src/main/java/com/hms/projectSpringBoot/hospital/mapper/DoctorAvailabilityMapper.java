package com.hms.projectSpringBoot.hospital.mapper;

import com.hms.projectSpringBoot.hospital.dto.DoctorAvailabilityRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.DoctorAvailabilityResponseDTO;
import com.hms.projectSpringBoot.hospital.entity.Doctor;
import com.hms.projectSpringBoot.hospital.entity.DoctorAvailability;
import org.springframework.stereotype.Component;

@Component
public class DoctorAvailabilityMapper {

    // DTO + resolved Doctor entity -> new availability entity
    // (doctor is passed in separately because it comes from the path
    // variable /doctor/{doctorId}, not from the request body)
    public DoctorAvailability toEntity(
            DoctorAvailabilityRequestDTO dto, Doctor doctor) {

        return DoctorAvailability.builder()
                .doctor(doctor)
                .date(dto.getDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();
    }

    // entity from DB -> DTO going out to the client
    // flattens the nested Doctor into just id + name, instead of
    // serializing the doctor's email/phone/specialization every time
    public DoctorAvailabilityResponseDTO toResponseDTO(
            DoctorAvailability availability) {

        return DoctorAvailabilityResponseDTO.builder()
                .id(availability.getId())
                .doctorId(availability.getDoctor().getId())
                .doctorName(availability.getDoctor().getName())
                .date(availability.getDate())
                .startTime(availability.getStartTime())
                .endTime(availability.getEndTime())
                .available(availability.getAvailable())
                .build();
    }

    // apply an update DTO onto an existing managed entity
    public void updateEntityFromDto(
            DoctorAvailabilityRequestDTO dto,
            DoctorAvailability existingAvailability) {

        existingAvailability.setDate(dto.getDate());
        existingAvailability.setStartTime(dto.getStartTime());
        existingAvailability.setEndTime(dto.getEndTime());
    }
}

/*
Why toEntity takes a Doctor parameter instead of just the DTO: unlike Patient/Doctor,
this entity's owning relationship (doctor) isn't part of the request body at all —
it comes from the URL path (/api/doctor-availability/doctor/{doctorId}).
The service resolves the Doctor entity first (throwing ResourceNotFoundException if it doesn't exist),
then hands it to the mapper.
This keeps the mapper "dumb" — it never talks to a repository itself.
 */