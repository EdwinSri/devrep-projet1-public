package com.sar.devrepprojet1.domain.user.form;

import com.sar.devrepprojet1.domain.timeslot.TimeSlot;

import java.util.List;

public class ProSearchResult {
    private String firstName;
    private String lastName;
    private String address;
    private String profession;
    private List<TimeSlot> freeTimeSlots;

    public ProSearchResult() {
    }
    public ProSearchResult(String firstName, String lastName, String address, String profession) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.profession = profession;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public List<TimeSlot> getFreeTimeSlots() {
        return freeTimeSlots;
    }

    public void setFreeTimeSlots(List<TimeSlot> freeTimeSlots) {
        this.freeTimeSlots = freeTimeSlots;
    }
}
