package com.sar.devrepprojet1.services.timeslot;

import com.sar.devrepprojet1.domain.timeslot.AddTimeSlotParams;
import com.sar.devrepprojet1.domain.timeslot.BookAppointmentForm;
import com.sar.devrepprojet1.domain.timeslot.RescheduleAppointmentParams;
import com.sar.devrepprojet1.domain.timeslot.TimeSlot;
import com.sar.devrepprojet1.repositories.TimeSlotRepository;
import com.sar.devrepprojet1.repositories.UserRepository;
import com.sar.devrepprojet1.services.exceptions.TimeSlotNotFoundException;
import com.sar.devrepprojet1.utils.UserUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;

    public TimeSlotService(TimeSlotRepository timeSlotRepository, UserRepository userRepository) {

        this.timeSlotRepository = timeSlotRepository;
        this.userRepository = userRepository;
    }

    public TimeSlot findById(Long id) {
        return timeSlotRepository.findById(id)
                .orElseThrow(() -> new TimeSlotNotFoundException(id));
    }

    public List<TimeSlot> findByUser() {
        Long userId = UserUtils.getLoggedUserId(userRepository);
        return timeSlotRepository.findByPatientId(userId)
                .orElseThrow(() -> new TimeSlotNotFoundException(userId));
    }

    public Long saveOpenSlot(AddTimeSlotParams addTimeSlotParams) {
        Long userId = UserUtils.getLoggedUserId(userRepository);
        TimeSlot timeSlot = new TimeSlot();
        LocalDateTime start = LocalDateTime.parse(addTimeSlotParams.getStartDateTime());
        LocalDateTime end = LocalDateTime.parse(addTimeSlotParams.getEndDateTime());

        timeSlot.setProfessional(userId);
        timeSlot.setStartDateTime(start);
        timeSlot.setEndDateTime(end);

        TimeSlot saved = timeSlotRepository.save(timeSlot);

        return saved.getId();
    }

    public void cancelAppointmentById(Long id) {
        TimeSlot timeSlot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new TimeSlotNotFoundException(id));
        timeSlot.setPatientId(null);
        timeSlotRepository.save(timeSlot);
    }

    public void deleteOpenSlot(Long id) {
        timeSlotRepository.deleteById(id);
    }

    public void rescheduleAppointment(RescheduleAppointmentParams rescheduleAppointmentParams) {
        Long oldId = rescheduleAppointmentParams.getOldTimeSlotId();
        TimeSlot oldTimeSlot = timeSlotRepository.findById(oldId)
                .orElseThrow(() -> new TimeSlotNotFoundException(oldId));

        Long patientId = oldTimeSlot.getPatientId();

        oldTimeSlot.setPatientId(null);
        timeSlotRepository.save(oldTimeSlot);

        Long newId = rescheduleAppointmentParams.getNewTimeSlotId();
        TimeSlot newTimeSlot = timeSlotRepository.findById(newId)
                .orElseThrow(() -> new TimeSlotNotFoundException(newId));

        if (newTimeSlot.getPatientId() != null)
            throw new RuntimeException();

        newTimeSlot.setPatientId(patientId);
        timeSlotRepository.save(newTimeSlot);
    }

    public void bookAppointment(BookAppointmentForm bookAppointmentForm) {
        Long userId = UserUtils.getLoggedUserId(userRepository);
        Long id = bookAppointmentForm.getTimeSlotId();
        TimeSlot timeSlot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new TimeSlotNotFoundException(id));

        if (timeSlot.getPatientId() != null)
            throw new RuntimeException();

        timeSlot.setPatientId(userId);
        timeSlotRepository.save(timeSlot);
    }

    public List<TimeSlot> findByProfessional() {
        Long professionalId = UserUtils.getLoggedUserId(userRepository);
        return timeSlotRepository.findByProfessionalId(professionalId)
                .orElseThrow(() -> new TimeSlotNotFoundException(professionalId));
    }

    public List<TimeSlot> findFreeSlotsByPro(Long id) {
        return timeSlotRepository.findByProfessionalIdAndPatientIdIsNull(id)
                .orElseThrow(() -> new TimeSlotNotFoundException(id));
    }
}
