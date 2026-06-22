package com.company.leavemanagement.repository;

import com.company.leavemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Used during Login: Finds a user matching the exact email string
    Optional<User> findByEmail(String email);
    
    // Used during Registration: Instantly checks if an email already exists in MySQL
    boolean existsByEmail(String email);
}
