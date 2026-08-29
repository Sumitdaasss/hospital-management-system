package com.hms.projectSpringBoot.hospital.dto;

import com.hms.projectSpringBoot.hospital.entity.Gender;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 7, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must be exactly 10 digits"
    )
    private String phone;

    @NotBlank(message = "Specialization is required")
    @Size(max = 100, message = "Specialization must be under 100 characters")
    private String specialization;

    @Size(max = 100, message = "Qualification must be under 100 characters")
    private String qualification;

    @Min(value = 0, message = "Experience cannot be negative")
    @Max(value = 60, message = "Experience seems unrealistic (max 60 years)")
    private Integer experience;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @Size(max = 255, message = "Address must be under 255 characters")
    private String address;
}