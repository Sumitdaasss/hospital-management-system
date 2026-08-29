package com.hms.projectSpringBoot.hospital.service;

import com.hms.projectSpringBoot.hospital.dto.PatientRequestDTO;
import com.hms.projectSpringBoot.hospital.dto.PatientResponseDTO;
import com.hms.projectSpringBoot.hospital.entity.Patient;
import com.hms.projectSpringBoot.hospital.exception.DuplicateResourceException;
import com.hms.projectSpringBoot.hospital.exception.ResourceNotFoundException;
import com.hms.projectSpringBoot.hospital.mapper.PatientMapper;
import com.hms.projectSpringBoot.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    public PatientResponseDTO createPatient(PatientRequestDTO requestDTO) {

        if (patientRepository.existsByEmail(requestDTO.getEmail())) {
            throw new DuplicateResourceException(
                    "Patient with this email already exists"
            );
        }

        Patient patient = patientMapper.toEntity(requestDTO);
        Patient savedPatient = patientRepository.save(patient); // save the patient send credentials in repo

        return patientMapper.toResponseDTO(savedPatient);
    }

    public List<PatientResponseDTO> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(patientMapper::toResponseDTO)
                .toList();
    }

    public PatientResponseDTO getPatientById(Long id) {

        Patient patient = findPatientEntityById(id);

        return patientMapper.toResponseDTO(patient);
    }

    public PatientResponseDTO updatePatient(Long id, PatientRequestDTO patientRequestDTO) {

        Patient existingPatient = findPatientEntityById(id);

        patientMapper.updateEntityFromDto(patientRequestDTO, existingPatient);

        Patient updatedPatient = patientRepository.save(existingPatient);

        return patientMapper.toResponseDTO(updatedPatient);
    }

    public void deletePatient(Long id) {
        Patient patient = findPatientEntityById(id);
        patientRepository.delete(patient);
    }

    /*
    Why findPatientEntityById is private: it returns the JPA entity, not the DTO — that's an internal detail the controller never needs.
    Only getPatientById (public) exposes the DTO version.
     */

    // internal helper - other services (e.g. AppointmentService) will need
    // the raw entity, not the DTO, so this stays package-visible via the class
    private Patient findPatientEntityById(Long id) {

        return patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient", id));
    }
}