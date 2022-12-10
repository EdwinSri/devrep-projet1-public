package com.sar.devrepprojet1.domain.timeslot;

public class RescheduleAppointmentParams {
    Long oldTimeSlotId;
    Long newTimeSlotId;

    public Long getOldTimeSlotId() {
        return oldTimeSlotId;
    }

    public void setOldTimeSlotId(Long oldTimeSlotId) {
        this.oldTimeSlotId = oldTimeSlotId;
    }

    public Long getNewTimeSlotId() {
        return newTimeSlotId;
    }

    public void setNewTimeSlotId(Long newTimeSlotId) {
        this.newTimeSlotId = newTimeSlotId;
    }
}
