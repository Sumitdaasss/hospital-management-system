package com.hms.projectSpringBoot.hospital.dto;

import com.hms.projectSpringBoot.hospital.entity.Gender;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class PatientResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
    private String bloodGroup;
    private String healthProblem;
}
/*
Why request/response are split: the request DTO has @NotBlank/@Email validation and no id field
(the client shouldn't set it).
The response DTO has id but no validation annotations, since it's outbound data.
 */