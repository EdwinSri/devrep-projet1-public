package com.sar.devrepprojet1.controllers;

import com.sar.devrepprojet1.config.WebSecurityConfig;
import com.sar.devrepprojet1.domain.user.form.ProSearchResult;
import com.sar.devrepprojet1.domain.user.User;
import com.sar.devrepprojet1.domain.user.form.NewUserForm;
import com.sar.devrepprojet1.services.user.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = WebSecurityConfig.SECURITY_CONFIG_NAME)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/user")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_PROFESSIONAL')")
    public ResponseEntity<User> getUser() {
        return ResponseEntity.ok(userService.getUser());
    }

    @PutMapping(value = "/user")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_PROFESSIONAL')")
    public ResponseEntity updateUser(@RequestBody NewUserForm newUserForm) {
        User user = userService.updateUser(newUserForm);

        if(user == null) {
            return new ResponseEntity(HttpStatus.CONFLICT);
        } else {
            return ResponseEntity.ok(user);
        }
    }

    @GetMapping(value = "/search")
    public ResponseEntity<List<ProSearchResult>> searchPro(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchPro(query));
    }

    @GetMapping(value = "/pro-info/{id}")
    public ResponseEntity<User> findProById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(userService.findUserById(id));
    }
}
