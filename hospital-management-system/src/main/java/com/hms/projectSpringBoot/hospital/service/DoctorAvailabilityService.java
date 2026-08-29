package com.hms.projectSpringBoot.hospital.service;

import com.hms.projectSpringBoot.hospital.dto.DoctorAvailabilityRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.DoctorAvailabilityResponseDTO;
import com.hms.projectSpringBoot.hospital.entity.Doctor;
import com.hms.projectSpringBoot.hospital.entity.DoctorAvailability;
import com.hms.projectSpringBoot.hospital.exception.InvalidRequestException;
import com.hms.projectSpringBoot.hospital.exception.ResourceNotFoundException;
import com.hms.projectSpringBoot.hospital.mapper.DoctorAvailabilityMapper;
import com.hms.projectSpringBoot.hospital.repository.DoctorAvailabilityRepository;
import com.hms.projectSpringBoot.hospital.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilityMapper availabilityMapper;

    public DoctorAvailabilityResponseDTO createAvailability(
            Long doctorId,
            DoctorAvailabilityRequestDTO requestDTO
    ) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor", doctorId));

        validateTimeRange(requestDTO.getStartTime(), requestDTO.getEndTime());

        DoctorAvailability availability = availabilityMapper.toEntity(requestDTO, doctor);
        availability.setAvailable(true);

        DoctorAvailability saved = availabilityRepository.save(availability);

        return availabilityMapper.toResponseDTO(saved);
    }

    public List<DoctorAvailabilityResponseDTO> getDoctorAvailability(Long doctorId) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", doctorId);
        }

        return availabilityRepository.findByDoctorId(doctorId)
                .stream()
                .map(availabilityMapper::toResponseDTO)
                .toList();
    }

    public List<DoctorAvailabilityResponseDTO> getDoctorAvailabilityByDate(
            Long doctorId,
            LocalDate date
    ) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", doctorId);
        }

        return availabilityRepository
                .findByDoctorIdAndDateAndAvailableTrue(doctorId, date)
                .stream()
                .map(availabilityMapper::toResponseDTO)
                .toList();
    }

    public DoctorAvailabilityResponseDTO updateAvailability(
            Long id,
            DoctorAvailabilityRequestDTO requestDTO
    ) {

        DoctorAvailability existingAvailability = findAvailabilityEntityById(id);

        validateTimeRange(requestDTO.getStartTime(), requestDTO.getEndTime());

        availabilityMapper.updateEntityFromDto(requestDTO, existingAvailability);

        DoctorAvailability updated =
                availabilityRepository.save(existingAvailability);

        return availabilityMapper.toResponseDTO(updated);
    }

    public void deleteAvailability(Long id) {

        DoctorAvailability availability = findAvailabilityEntityById(id);

        availabilityRepository.delete(availability);
    }

    private void validateTimeRange(
            java.time.LocalTime startTime, java.time.LocalTime endTime) {

        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new InvalidRequestException(
                    "Start time must be before end time"
            );
        }
    }

    // internal helper - AppointmentService also needs the raw entity
    // when checking a doctor's open slots
    private DoctorAvailability findAvailabilityEntityById(Long id) {

        return availabilityRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor availability", id));
    }
}

/*
Why validateTimeRange was pulled into its own private method:
your original code duplicated the same isAfter/equals check only in createAvailability.
Since updateAvailability lets a client change startTime/endTime too, the same rule needs to apply there —
otherwise someone could PUT an invalid range through update even though create blocks it.
Centralizing it means the rule can't drift out of sync between the two paths.
 */