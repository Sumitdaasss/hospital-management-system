package com.hms.projectSpringBoot.hospital.dto;

import com.hms.projectSpringBoot.hospital.entity.Gender;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DoctorResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String qualification;
    private Integer experience;
    private Gender gender;
    private String address;
    private Boolean available;
}