package com.sar.devrepprojet1.domain.timeslot;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "time_slots")
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "start_datetime")
    private LocalDateTime startDateTime;

    @Column(name = "end_datetime")
    private LocalDateTime endDateTime;

    @JoinColumn(name = "professional_id", referencedColumnName = "id")
    private Long professionalId;

    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Long patientId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime dateTime) {
        this.startDateTime = dateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public void setProfessionalId(Long professionalId) {
        this.professionalId = professionalId;
    }

    public Long getProfessionalId() {
        return professionalId;
    }

    public void setProfessional(Long professionalId) {
        this.professionalId = professionalId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patient) {
        this.patientId = patient;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof TimeSlot))
            return false;
        TimeSlot otherTimeSlot = (TimeSlot) other;
        if (!professionalId.equals(otherTimeSlot.professionalId))
            return false;
        if (!startDateTime.equals(otherTimeSlot.startDateTime))
            return false;
        if (!endDateTime.equals(otherTimeSlot.endDateTime))
            return false;
        return true;
    }
}
