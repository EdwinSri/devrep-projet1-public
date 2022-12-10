package com.sar.devrepprojet1.domain.user.form;

import com.sar.devrepprojet1.domain.user.UserRole;

public class NewUserForm {

    private final UserRole userRole;
    private final String email;
    private final String password;
    private final String firstName;
    private final String lastName;
    private final String phoneNumber;
    private final String address;
    private final String profession;

    public NewUserForm(UserRole userRole, String email, String password, String firstName, String lastName, String address,
                       String profession, String phoneNumber) {
        this.userRole = userRole;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.profession = profession;
        this.phoneNumber = phoneNumber;
    }

    public boolean isValid() {
        if (userRole == null || email == null || password == null || firstName == null || lastName == null || phoneNumber == null) {
            return false;
        }

        if (userRole == UserRole.ROLE_PROFESSIONAL) {
            if (address == null || profession == null) {
                return false;
            }
        }
        return true;
    }
    public UserRole getUserRole() {
        return userRole;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getProfession() {
        return profession;
    }
}
