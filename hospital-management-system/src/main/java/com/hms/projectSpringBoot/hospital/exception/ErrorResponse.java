/*
ErrorResponse.java

A DTO used only by the exception handler, to give every error a consistent JSON shape.
 */
package com.hms.projectSpringBoot.hospital.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ErrorResponse {

    private int status;
    private String error;
    private String message;
    private String path;
    private LocalDateTime timestamp;
}

/*
Why: without this, every error response has a different shape (stack trace HTML, or nothing).
With it, every failure — 404, 409, 400, validation, 500 — returns the same predictable JSON,
which your frontend can parse once.
 */