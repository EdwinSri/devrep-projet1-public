package com.sar.devrepprojet1.controllers;

import com.sar.devrepprojet1.config.WebSecurityConfig;
import com.sar.devrepprojet1.domain.timeslot.AddTimeSlotParams;
import com.sar.devrepprojet1.domain.timeslot.BookAppointmentForm;
import com.sar.devrepprojet1.domain.timeslot.RescheduleAppointmentParams;
import com.sar.devrepprojet1.domain.timeslot.TimeSlot;
import com.sar.devrepprojet1.services.timeslot.TimeSlotService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = WebSecurityConfig.SECURITY_CONFIG_NAME)
public class TimeSlotController {

    private final TimeSlotService service;

    public TimeSlotController(TimeSlotService service) {
        this.service = service;
    }

    @GetMapping(value = "/user/appointments")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_PROFESSIONAL')")
    public ResponseEntity<List<TimeSlot>> findByUser() {
        return ResponseEntity.ok(service.findByUser());
    }


    @GetMapping(value = "/pro/slots")
    @PreAuthorize("hasAuthority('ROLE_PROFESSIONAL')")
    public ResponseEntity<List<TimeSlot>> findByProfessional() {
        return ResponseEntity.ok(service.findByProfessional());
    }

    @PostMapping(value = "/pro/slots")
    @PreAuthorize("hasAuthority('ROLE_PROFESSIONAL')")
    public ResponseEntity<Long> saveOpenSlot(@RequestBody AddTimeSlotParams addTimeSlotParams) {
        return new ResponseEntity(service.saveOpenSlot(addTimeSlotParams), HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/pro/slots/{id}")
    @PreAuthorize("hasAuthority('ROLE_PROFESSIONAL')")
    public ResponseEntity deleteOpenSlot(@PathVariable("id") Long id) {
        service.deleteOpenSlot(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(value = "/user/appointments/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_PROFESSIONAL')")
    public ResponseEntity cancelAppointment(@PathVariable("id") Long id) {
        service.cancelAppointmentById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/user/book-appointment")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_PROFESSIONAL')")
    public ResponseEntity bookAppointment(@RequestBody BookAppointmentForm bookAppointmentForm) {
        service.bookAppointment(bookAppointmentForm);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/user/reschedule-appointment")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_PROFESSIONAL')")
    public ResponseEntity rescheduleAppointment(@RequestBody RescheduleAppointmentParams rescheduleAppointmentParams) {
        service.rescheduleAppointment(rescheduleAppointmentParams);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/pro-info/{id}/free-slots")
    public ResponseEntity<List<TimeSlot>> findFreeSlotsByPro(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.findFreeSlotsByPro(id));
    }
}
