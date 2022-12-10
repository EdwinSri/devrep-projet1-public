package com.sar.devrepprojet1.services.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String email) {
        super("Could not find user with email " + email);
    }
}
