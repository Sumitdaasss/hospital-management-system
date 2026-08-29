/*
ResourceNotFoundException.java

Replaces every new RuntimeException("X not found with id: " + id) you currently have in PatientService,
DoctorService, AppointmentService, DoctorAvailabilityService.
 */

package com.hms.projectSpringBoot.hospital.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " not found with id: " + id);
    }
}

/*
Why: gives the global handler a specific type to catch and map to 404 NOT FOUND,
instead of guessing what a generic RuntimeException meant.
 */