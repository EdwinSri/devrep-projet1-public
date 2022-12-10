package com.sar.devrepprojet1.controllers;

import com.sar.devrepprojet1.domain.user.form.LoginForm;
import com.sar.devrepprojet1.domain.user.form.LoginResult;
import com.sar.devrepprojet1.domain.user.form.NewUserForm;
import com.sar.devrepprojet1.services.exceptions.NewUserCreationFailedException;
import com.sar.devrepprojet1.services.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value = "/signup")
    public ResponseEntity<Long> signup(@RequestBody NewUserForm newUserForm) {
        try {
            Long id = userService.addNewUser(newUserForm);
            return ResponseEntity.ok(id);
        } catch(NewUserCreationFailedException e) {
            return new ResponseEntity<>(-1L, HttpStatus.BAD_REQUEST);

        }
    }

    @PostMapping(value = "/login")
    public ResponseEntity<LoginResult> login(@RequestBody LoginForm loginForm) {
        try {
            return ResponseEntity.ok(userService.login(loginForm));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

}
