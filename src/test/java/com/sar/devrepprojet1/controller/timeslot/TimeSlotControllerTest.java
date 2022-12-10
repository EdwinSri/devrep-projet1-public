package com.sar.devrepprojet1.controller.timeslot;

import com.sar.devrepprojet1.controllers.TimeSlotController;
import com.sar.devrepprojet1.controllers.UserController;
import com.sar.devrepprojet1.domain.timeslot.TimeSlot;
import com.sar.devrepprojet1.domain.user.User;
import com.sar.devrepprojet1.domain.user.UserRole;
import com.sar.devrepprojet1.repositories.TimeSlotRepository;
import com.sar.devrepprojet1.repositories.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;


@SpringBootTest
public class TimeSlotControllerTest {

    @Autowired
    private TimeSlotRepository timeSlotRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TimeSlotController timeSlotController;

    @Test
    public void givenTimeSlots_whenFindById_thenOk() {
        try {
            TimeSlot timeSlot = new TimeSlot();
            LocalDateTime dateTime = LocalDateTime.now();
            timeSlot.setStartDateTime(dateTime);
            timeSlotRepository.save(timeSlot);
            Assertions.assertEquals(dateTime.truncatedTo(ChronoUnit.SECONDS), timeSlotRepository.findByStartDateTime(dateTime).orElse(null).getStartDateTime());
        } finally {
            timeSlotRepository.deleteAll();
        }
    }

    @Test
    public void givenTimeSlots_whenCancelAppointmentById_thenOk() {
        try {
            User patient = new User();
            patient.setUserRole(UserRole.ROLE_USER);
            Long patientId = userRepository.save(patient).getId();

            User pro = new User();
            pro.setUserRole(UserRole.ROLE_PROFESSIONAL);
            Long proId = userRepository.save(pro).getId();


            TimeSlot timeSlot = new TimeSlot();
            LocalDateTime dateTime = LocalDateTime.now();
            timeSlot.setStartDateTime(dateTime);
            timeSlot.setPatientId(patientId);
            timeSlot.setProfessionalId(proId);
            TimeSlot saved = timeSlotRepository.save(timeSlot);
            timeSlotController.cancelAppointment(saved.getId());
            Long postCancelPatientId = timeSlotRepository.findById(saved.getId()).orElse(null).getPatientId();
            Assertions.assertEquals(null, postCancelPatientId);
        } finally {
            timeSlotRepository.deleteAll();
            userRepository.deleteAll();
        }
    }
}
