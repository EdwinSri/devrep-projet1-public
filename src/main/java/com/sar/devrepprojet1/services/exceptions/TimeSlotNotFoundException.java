package com.sar.devrepprojet1.services.exceptions;

public class TimeSlotNotFoundException extends RuntimeException {
    public TimeSlotNotFoundException(Long id) {
        super("Could not find timeslot with id, professional id or patient id " + id);
    }
}
