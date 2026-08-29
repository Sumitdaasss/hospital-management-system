package com.hms.projectSpringBoot.hospital.service;

import com.hms.projectSpringBoot.hospital.dto.AppointmentRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.AppointmentResponseDTO;
import com.hms.projectSpringBoot.hospital.entity.Appointment;
import com.hms.projectSpringBoot.hospital.entity.AppointmentStatus;
import com.hms.projectSpringBoot.hospital.entity.Doctor;
import com.hms.projectSpringBoot.hospital.entity.Patient;
import com.hms.projectSpringBoot.hospital.exception.InvalidRequestException;
import com.hms.projectSpringBoot.hospital.exception.ResourceNotFoundException;
import com.hms.projectSpringBoot.hospital.mapper.AppointmentMapper;
import com.hms.projectSpringBoot.hospital.repository.AppointmentRepository;
import com.hms.projectSpringBoot.hospital.repository.DoctorAvailabilityRepository;
import com.hms.projectSpringBoot.hospital.repository.DoctorRepository;
import com.hms.projectSpringBoot.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final AppointmentMapper appointmentMapper;

    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO AppointmentrequestDTO) {

        Patient patient = patientRepository.findById(AppointmentrequestDTO.getPatientId()).orElseThrow(() ->
                        new ResourceNotFoundException("Patient", AppointmentrequestDTO.getPatientId()));

        Doctor doctor = doctorRepository.findById(AppointmentrequestDTO.getDoctorId()).orElseThrow(() ->
                        new ResourceNotFoundException("Doctor", AppointmentrequestDTO.getDoctorId()));

        if (!Boolean.TRUE.equals(doctor.getAvailable())) {
            throw new InvalidRequestException("Doctor is currently unavailable");
        }

        boolean doctorHasAvailability = availabilityRepository
                        .findByDoctorIdAndDateAndAvailableTrue(
                                AppointmentrequestDTO.getDoctorId(),
                                AppointmentrequestDTO.getAppointmentDate()
                        )
                        .stream()
                        .anyMatch(availability ->
                                !AppointmentrequestDTO.getAppointmentTime().isBefore(
                                        availability.getStartTime()
                                )
                                        &&
                                        !AppointmentrequestDTO.getAppointmentTime().isAfter(
                                                availability.getEndTime()
                                        )
                        );

        if (!doctorHasAvailability) {
            throw new InvalidRequestException(
                    "Doctor is not available at the selected date and time"
            );
        }

        boolean alreadyBooked = appointmentRepository
                        .existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                                AppointmentrequestDTO.getDoctorId(),
                                AppointmentrequestDTO.getAppointmentDate(),
                                AppointmentrequestDTO.getAppointmentTime()
                        );

        if (alreadyBooked) {
            throw new InvalidRequestException(
                    "This appointment slot is already booked"
            );
        }

        Appointment appointment = appointmentMapper.toEntity(AppointmentrequestDTO, patient, doctor);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return appointmentMapper.toResponseDTO(savedAppointment);
    }

    public List<AppointmentResponseDTO> getAllAppointments() {

        return appointmentRepository.findAll()
                .stream()
                .map(appointmentMapper::toResponseDTO)
                .toList();
    }

    public AppointmentResponseDTO getAppointmentById(Long id) {

        Appointment appointment = findAppointmentEntityById(id);

        return appointmentMapper.toResponseDTO(appointment);
    }

    public List<AppointmentResponseDTO> getPatientAppointments(Long patientId) {

        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient", patientId);
        }

        return appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(appointmentMapper::toResponseDTO)
                .toList();
    }

    public List<AppointmentResponseDTO> getDoctorAppointments(Long doctorId) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", doctorId);
        }

        return appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(appointmentMapper::toResponseDTO)
                .toList();
    }

    public List<AppointmentResponseDTO> getDoctorAppointmentsByDate(
            Long doctorId,
            LocalDate date
    ) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", doctorId);
        }

        return appointmentRepository
                .findByDoctorIdAndAppointmentDate(doctorId, date)
                .stream()
                .map(appointmentMapper::toResponseDTO)
                .toList();
    }

    public AppointmentResponseDTO updateAppointmentStatus(
            Long appointmentId,
            AppointmentStatus status
    ) {

        Appointment appointment = findAppointmentEntityById(appointmentId);

        appointment.setStatus(status);

        Appointment updated = appointmentRepository.save(appointment);

        return appointmentMapper.toResponseDTO(updated);
    }

    public AppointmentResponseDTO cancelAppointment(Long appointmentId) {

        Appointment appointment = findAppointmentEntityById(appointmentId);

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new InvalidRequestException(
                    "Completed appointment cannot be cancelled"
            );
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        Appointment updated = appointmentRepository.save(appointment);

        return appointmentMapper.toResponseDTO(updated);
    }

    // internal helper - not exposed outside the service
    private Appointment findAppointmentEntityById(Long id) {

        return appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment", id));
    }
}