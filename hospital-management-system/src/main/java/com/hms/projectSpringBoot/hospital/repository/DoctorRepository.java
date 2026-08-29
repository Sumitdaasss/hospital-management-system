package com.hms.projectSpringBoot.hospital.repository;

import com.hms.projectSpringBoot.hospital.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    List<Doctor> findBySpecialization(String specialization);

    List<Doctor> findByAvailableTrue();

    List<Doctor> findBySpecializationAndAvailableTrue(String specialization);
}