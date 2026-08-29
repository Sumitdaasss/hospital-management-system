/*
InvalidRequestException.java

Replaces business-rule violations like "Doctor is currently unavailable",
"Start time must be before end time", "Completed appointment cannot be cancelled".
 */

package com.hms.projectSpringBoot.hospital.exception;

public class InvalidRequestException extends RuntimeException {

    public InvalidRequestException(String message) {
        super(message);
    }
}

/*
Why: maps to 400 BAD REQUEST — the request was well-formed but violates a business rule.
 */