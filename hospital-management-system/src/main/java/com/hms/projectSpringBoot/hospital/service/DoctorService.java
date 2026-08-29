package com.hms.projectSpringBoot.hospital.service;

import com.hms.projectSpringBoot.hospital.dto.DoctorRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.DoctorResponseDTO;
import com.hms.projectSpringBoot.hospital.entity.Doctor;
import com.hms.projectSpringBoot.hospital.exception.DuplicateResourceException;
import com.hms.projectSpringBoot.hospital.exception.ResourceNotFoundException;
import com.hms.projectSpringBoot.hospital.mapper.DoctorMapper;
import com.hms.projectSpringBoot.hospital.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    // Creating Doctor
    public DoctorResponseDTO createDoctor(DoctorRequestDTO doctorRequestDTO) {

        if (doctorRepository.existsByEmail(doctorRequestDTO.getEmail())) {
            throw new DuplicateResourceException(
                    "Doctor with this email already exists"
            );
        }

        Doctor doctor = doctorMapper.toEntity(doctorRequestDTO);
        doctor.setAvailable(true);

        Doctor savedDoctor = doctorRepository.save(doctor);

        return doctorMapper.toResponseDTO(savedDoctor);
    }

    // Get All Doctors by using List from Collection framework
    public List<DoctorResponseDTO> getAllDoctors() {

        return doctorRepository.findAll().stream()
                .map(doctorMapper::toResponseDTO)
                .toList();
    }

    // Get Doctor By Its ID
    public DoctorResponseDTO getDoctorById(Long id) {

        Doctor doctor = findDoctorEntityById(id);

        return doctorMapper.toResponseDTO(doctor);
    }

    // Update Doctor
    public DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO requestDTO) {

        Doctor existingDoctor = findDoctorEntityById(id);

        if (doctorRepository.existsByEmailAndIdNot(
                requestDTO.getEmail(), id)) {

            throw new DuplicateResourceException("Doctor with this email already exists");
        }

        doctorMapper.updateEntityFromDto(requestDTO, existingDoctor);

        Doctor updatedDoctor = doctorRepository.save(existingDoctor);

        return doctorMapper.toResponseDTO(updatedDoctor);
    }

    // Delete Doctor
    public void deleteDoctor(Long id) {

        Doctor doctor = findDoctorEntityById(id);

        doctorRepository.delete(doctor);
    }

    // Get Doctor By their Specialization
    public List<DoctorResponseDTO> getDoctorsBySpecialization(String specialization) {

        return doctorRepository.findBySpecialization(specialization)
                .stream()
                .map(doctorMapper::toResponseDTO)
                .toList();
    }

    public List<DoctorResponseDTO> getAvailableDoctors() {

        return doctorRepository.findByAvailableTrue()
                .stream()
                .map(doctorMapper::toResponseDTO)
                .toList();
    }

    public List<DoctorResponseDTO> getAvailableDoctorsBySpecialization(String specialization) {

        return doctorRepository
                .findBySpecializationAndAvailableTrue(specialization)
                .stream()
                .map(doctorMapper::toResponseDTO)
                .toList();
    }

    // internal helper - other services (e.g. AppointmentService,
    // DoctorAvailabilityService) need the raw entity, not the DTO
    private Doctor findDoctorEntityById(Long id) {

        return doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor", id));
    }
}