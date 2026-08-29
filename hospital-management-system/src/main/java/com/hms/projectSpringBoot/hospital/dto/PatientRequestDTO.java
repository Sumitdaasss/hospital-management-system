/*
dto package

Each entity gets a Request DTO (what the client sends in) and a Response DTO (what the client gets back).
This is the standard reason to add DTOs: the entity has fields you don't want writable from outside
(id, available on Doctor)and associations you don't want serialized directly
(Appointment.doctor pulling in the whole Doctor object).
 */
package com.hms.projectSpringBoot.hospital.dto;

import com.hms.projectSpringBoot.hospital.entity.Gender;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PatientRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must be exactly 10 digits"
    )
    private String phone;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @Size(max = 255, message = "Address must be under 255 characters")
    private String address;

    @Pattern(
            regexp = "^(A|B|AB|O)[+-]$",
            message = "Blood group must be one of A+, A-, B+, B-, AB+, AB-, O+, O-"
    )
    private String bloodGroup;

    @Size(max = 1000, message = "Health problem description must be under 1000 characters")
    private String healthProblem;
}
