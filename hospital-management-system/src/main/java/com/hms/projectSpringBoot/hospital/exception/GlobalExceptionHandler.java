package com.hms.projectSpringBoot.hospital.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 - thrown by services when an entity lookup fails
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {

        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    // 409 - thrown when a unique constraint / duplicate rule is violated
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(
            DuplicateResourceException ex, HttpServletRequest request) {

        return build(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    // 400 - thrown when a business rule is broken (e.g. doctor unavailable)
    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ErrorResponse> handleInvalidRequest(
            InvalidRequestException ex, HttpServletRequest request) {

        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    // 400 - thrown automatically when @Valid fails on a request DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        return ResponseEntity.badRequest().body(fieldErrors);
    }

    // 500 - fallback safety net for anything unexpected/unmapped
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex, HttpServletRequest request) {

        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request);
    }

    /*
    One more piece needed: when this validation fails, Spring throws ConstraintViolationException,
     not MethodArgumentNotValidException (that one's only for @RequestBody). Your current GlobalExceptionHandler
     doesn't handle it yet,
    so it would fall through to the generic 500 handler. Add this to GlobalExceptionHandler:
     */

    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(
            jakarta.validation.ConstraintViolationException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getConstraintViolations().forEach(violation ->
                errors.put(
                        violation.getPropertyPath().toString(),
                        violation.getMessage()
                )
        );

        return ResponseEntity.badRequest().body(errors);
    }

    /*
    One gap this surfaced: bad enum/date values

I mentioned it above for date — the same issue applies to @RequestParam AppointmentStatus status in updateAppointmentStatus.
If a client sends ?status=WHATEVER (not BOOKED/COMPLETED/CANCELLED), Spring can't convert the string to the enum and throws
MethodArgumentTypeMismatchException — which, like ConstraintViolationException, isn't handled by your current GlobalExceptionHandler yet,
 so it falls through to the generic 500.

Add this handler alongside the ConstraintViolationException one from before:
     */

    // 400 - thrown when a path variable or request param can't be converted
// to the expected type (bad enum value, malformed date, non-numeric id, etc.)

    @ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            org.springframework.web.method.annotation.MethodArgumentTypeMismatchException ex,
            HttpServletRequest request) {

        String message = String.format(
                "Invalid value '%s' for parameter '%s'",
                ex.getValue(),
                ex.getName()
        );

        return build(HttpStatus.BAD_REQUEST, message, request);
    }
    /*
    This closes the loop: every bad input a client could send — malformed JSON body, invalid enum, bad date,
    negative/blank path variable —
    now returns a clean 400 with a specific message, instead of leaking a 500 stack trace.
     */

    private ResponseEntity<ErrorResponse> build(
            HttpStatus status, String message, HttpServletRequest request) {

        ErrorResponse body = ErrorResponse.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(status).body(body);
    }

}