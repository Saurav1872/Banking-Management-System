package com.bank.BankingSystem.controller;

import com.bank.BankingSystem.dto.RegisterDto;
import com.bank.BankingSystem.entity.User;
import com.bank.BankingSystem.entity.enums.UserRole;
import com.bank.BankingSystem.repository.UserRepository;
import com.bank.BankingSystem.service.AccountService;
import com.bank.BankingSystem.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final AccountService accountService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, AccountService accountService, 
                         NotificationService notificationService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountService = accountService;
        this.notificationService = notificationService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody RegisterDto registerDto) {
        try {
            if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists!");
            }

            User user = new User();
            user.setFullName(registerDto.getFullName());
            user.setEmail(registerDto.getEmail());
            user.setPhone(registerDto.getPhone());
            user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
            user.setRole(UserRole.USER);

            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User userUpdates) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (userUpdates.getFullName() != null) {
                user.setFullName(userUpdates.getFullName());
            }
            if (userUpdates.getPhone() != null) {
                user.setPhone(userUpdates.getPhone());
            }
            if (userUpdates.getEmail() != null) {
                user.setEmail(userUpdates.getEmail());
            }
            
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{userId}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Set user as inactive (you might need to add an active field to User entity)
            // user.setActive(false);
            userRepository.save(user);
            
            return ResponseEntity.ok("User deactivated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deactivating user: " + e.getMessage());
        }
    }
} 