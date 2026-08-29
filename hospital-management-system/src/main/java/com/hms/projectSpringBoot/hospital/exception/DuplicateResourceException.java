/*
DuplicateResourceException.java

Replaces "Patient with this email already exists" in PatientService.createPatient,
and can also be used for Doctor email uniqueness and double-booked appointment slots.
 */

package com.hms.projectSpringBoot.hospital.exception;

public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}

/*
Why: maps to 409 CONFLICT — the correct HTTP status for "this already exists," not a 500.
 */