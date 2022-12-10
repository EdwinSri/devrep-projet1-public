package com.sar.devrepprojet1.repositories;

import com.sar.devrepprojet1.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<List<User>> findByProfession(String profession);
    Optional<List<User>> findByProfessionIgnoreCaseContaining(String profession);
}
