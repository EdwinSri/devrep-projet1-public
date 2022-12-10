package com.sar.devrepprojet1.utils;

import com.sar.devrepprojet1.domain.user.User;
import com.sar.devrepprojet1.repositories.UserRepository;
import com.sar.devrepprojet1.services.exceptions.UserNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserUtils {
    public static Long getLoggedUserId(UserRepository userRepository) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UserNotFoundException(currentUserEmail));
        Long professionalId = user.getId();
        return professionalId;
    }
}
