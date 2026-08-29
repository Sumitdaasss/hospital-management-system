package com.hms.projectSpringBoot.hospital.mapper;

import com.hms.projectSpringBoot.hospital.dto.DoctorRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.DoctorResponseDTO;
import com.hms.projectSpringBoot.hospital.entity.Doctor;
import org.springframework.stereotype.Component;

@Component
public class DoctorMapper {

    //Convert Request DTO → Entity
    // DTO coming in from the client -> new entity (available defaults handled in service)
    public Doctor toEntity(DoctorRequestDTO dto) {

        return Doctor.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .specialization(dto.getSpecialization())
                .qualification(dto.getQualification())
                .experience(dto.getExperience())
                .gender(dto.getGender())
                .address(dto.getAddress())
                .build();
    }

    //Convert Entity → Response DTO
    // entity from DB -> DTO going out to the client
    public DoctorResponseDTO toResponseDTO(Doctor doctor) {

        return DoctorResponseDTO.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperience())
                .gender(doctor.getGender())
                .address(doctor.getAddress())
                .available(doctor.getAvailable())
                .build();
    }

    // apply an update DTO onto an existing managed entity
    // note: "available" is NOT touched here on purpose (see DoctorService)

    /*
    This is used when updating an existing doctor.
    The important difference is that you're not creating a new entity.
     */
    public void updateEntityFromDto(DoctorRequestDTO dto, Doctor existingDoctor) {

        existingDoctor.setName(dto.getName());
        existingDoctor.setEmail(dto.getEmail());
        existingDoctor.setPhone(dto.getPhone());
        existingDoctor.setSpecialization(dto.getSpecialization());
        existingDoctor.setQualification(dto.getQualification());
        existingDoctor.setExperience(dto.getExperience());
        existingDoctor.setGender(dto.getGender());
        existingDoctor.setAddress(dto.getAddress());
    }
}
/*
Why available never appears in updateEntityFromDto: since it's not on the request DTO at all,
there's nothing to map. This closes the loophole your original DoctorController.updateDoctor had,
where a client could silently flip a doctor's availability through a normal profile update.
If you later want a client-facing toggle, it should be a dedicated endpoint like PATCH /api/doctors/{id}/availability,
not buried inside a general update.
 */