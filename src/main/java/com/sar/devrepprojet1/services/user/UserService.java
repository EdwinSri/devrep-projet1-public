package com.sar.devrepprojet1.services.user;

import com.sar.devrepprojet1.config.JwtHelper;
import com.sar.devrepprojet1.config.WebSecurityConfig;
import com.sar.devrepprojet1.domain.timeslot.TimeSlot;
import com.sar.devrepprojet1.domain.user.form.LoginResult;
import com.sar.devrepprojet1.domain.user.form.ProSearchResult;
import com.sar.devrepprojet1.domain.user.User;
import com.sar.devrepprojet1.domain.user.UserRole;
import com.sar.devrepprojet1.domain.user.form.LoginForm;
import com.sar.devrepprojet1.domain.user.form.NewUserForm;
import com.sar.devrepprojet1.repositories.TimeSlotRepository;
import com.sar.devrepprojet1.repositories.UserRepository;
import com.sar.devrepprojet1.services.exceptions.NewUserCreationFailedException;
import com.sar.devrepprojet1.services.exceptions.UserNotFoundException;
import com.sar.devrepprojet1.utils.UserUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;
    private final UserDetailsService userDetailsService;

    public UserService(UserRepository userRepository, TimeSlotRepository timeSlotRepository, PasswordEncoder passwordEncoder, JwtHelper jwtHelper, UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtHelper = jwtHelper;
        this.userDetailsService = userDetailsService;
    }

    public Long addNewUser(NewUserForm newUserForm) throws NewUserCreationFailedException {
        if(!newUserForm.isValid()) {
            throw new NewUserCreationFailedException();
        }

        if(userRepository.findByEmail(newUserForm.getEmail()).isPresent()) {
            throw new NewUserCreationFailedException();
        }

        User newUser = new User();
        newUser.setUserRole(newUserForm.getUserRole());
        newUser.setEmail(newUserForm.getEmail());
        newUser.setPassword(passwordEncoder.encode(newUserForm.getPassword()));
        newUser.setFirstName(newUserForm.getFirstName());
        newUser.setLastName(newUserForm.getLastName());
        newUser.setPhoneNumber(newUserForm.getPhoneNumber());

        if(newUser.getUserRole() == UserRole.ROLE_PROFESSIONAL) {
            newUser.setAddress(newUserForm.getAddress());
            newUser.setProfession(newUserForm.getProfession());
        }

        return userRepository.save(newUser).getId();

    }

    public LoginResult login(LoginForm loginForm) {
        UserDetails userDetails;

        try {
            userDetails = userDetailsService.loadUserByUsername(loginForm.getEmail());
        } catch (Exception e) {
            throw new UserNotFoundException(loginForm.getEmail());
        }
        if (passwordEncoder.matches(loginForm.getPassword(), userDetails.getPassword())) {
            Map<String, String> claims = new HashMap<>();
            claims.put("username", loginForm.getEmail());

            String authorities = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(" "));
            claims.put(WebSecurityConfig.AUTHORITIES_CLAIM_NAME, authorities);
            claims.put("userId", String.valueOf(1));

            String jwt = jwtHelper.createJwtForClaims(loginForm.getEmail(), claims);
            return new LoginResult(jwt);
        }

        throw new RuntimeException();
    }

    public User getUser() {
        Long userId = UserUtils.getLoggedUserId(userRepository);
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("user " + userId));
    }

    public User updateUser(NewUserForm userForm) {
        Long userId = UserUtils.getLoggedUserId(userRepository);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("user " + userId));

        Optional<User> existingUser = userRepository.findByEmail(userForm.getEmail());
        if(!user.getEmail().equals(userForm.getEmail())) {
            if(existingUser.isPresent())
                return null;
        }
        user.setEmail(userForm.getEmail());
        user.setFirstName(userForm.getFirstName());
        user.setLastName(userForm.getLastName());
        user.setPhoneNumber(user.getPhoneNumber());

        if(userForm.getAddress() != null)
            user.setAddress(userForm.getAddress());

        if(userForm.getProfession() != null)
            user.setProfession(userForm.getProfession());

        return userRepository.save(user);
    }

    public List<ProSearchResult> searchPro(String query) {
        Optional<List<User>> optionalUserList = userRepository.findByProfessionIgnoreCaseContaining(query);
        if(optionalUserList.isEmpty()) {
            return List.of();
        }

        List<User> userList = optionalUserList.get();
        List<ProSearchResult> result = new ArrayList<>();

        for(User user: userList) {
            ProSearchResult proSearchResult = new ProSearchResult(
                    user.getFirstName(),
                    user.getLastName(),
                    user.getAddress(),
                    user.getProfession()
            );
            Optional<List<TimeSlot>> optionalTimeSlots = timeSlotRepository.findByProfessionalIdAndPatientIdIsNull(user.getId());
            if(optionalTimeSlots.isEmpty()) {
                proSearchResult.setFreeTimeSlots(List.of());
            } else {
                proSearchResult.setFreeTimeSlots(optionalTimeSlots.get());
            }
            result.add(proSearchResult);
        }

        return result;
    }

    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id.toString()));
    }
}
