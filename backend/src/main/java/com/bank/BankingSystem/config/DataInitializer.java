package com.bank.BankingSystem.config;

import com.bank.BankingSystem.entity.User;
import com.bank.BankingSystem.entity.enums.UserRole;
import com.bank.BankingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default employee if not exists
        if (!userRepository.findByEmail("admin@bank.com").isPresent()) {
            User employee = new User();
            employee.setFullName("Bank Administrator");
            employee.setEmail("admin@bank.com");
            employee.setPhone("1234567890");
            employee.setPassword(passwordEncoder.encode("admin123"));
            employee.setRole(UserRole.EMPLOYEE);
            
            userRepository.save(employee);
            System.out.println("Default employee created: admin@bank.com / admin123");
        }

        // Create default test user if not exists
        if (!userRepository.findByEmail("test@gmail.com").isPresent()) {
            User user = new User();
            user.setFullName("Test User");
            user.setEmail("test@gmail.com");
            user.setPhone("9876543210");
            user.setPassword(passwordEncoder.encode("test123"));
            user.setRole(UserRole.USER);
            
            userRepository.save(user);
            System.out.println("Default user created: test@gmail.com / test123");
        }
    }
} 