package com.sar.devrepprojet1.repositories;

import com.sar.devrepprojet1.domain.timeslot.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    Optional<List<TimeSlot>> findByProfessionalId(Long id);
    Optional<List<TimeSlot>> findByPatientId(Long id);
    Optional<TimeSlot> findByStartDateTime(LocalDateTime startDateTime);

    Optional<List<TimeSlot>> findByProfessionalIdAndPatientIdIsNull(Long id);

}
