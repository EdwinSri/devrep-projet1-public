package com.sar.devrepprojet1.controller.user;

import com.sar.devrepprojet1.controllers.AuthController;
import com.sar.devrepprojet1.controllers.UserController;
import com.sar.devrepprojet1.domain.user.User;
import com.sar.devrepprojet1.domain.user.UserRole;
import com.sar.devrepprojet1.domain.user.form.NewUserForm;
import com.sar.devrepprojet1.repositories.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserControllerTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserController userController;

    @Autowired
    private AuthController authController;


    @Test
    public void givenValidNewUserForm_whenSignup_thenOk() {
        try {
            String email = "xyz@test.com";
            NewUserForm newUserForm = new NewUserForm(
                    UserRole.ROLE_USER,
                    email,
                    "myPassword",
                    "John",
                    "Doe",
                    null,
                    null,
                    "0643233433");

            Long id = authController.signup(newUserForm).getBody();
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException());
            Assertions.assertEquals(user.getEmail(), email);
        } finally {
            userRepository.deleteAll();
        }
    }

}
