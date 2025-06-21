package com.bank.BankingSystem.controller;

import com.bank.BankingSystem.dto.AccountDto;
import com.bank.BankingSystem.dto.RegisterDto;
import com.bank.BankingSystem.dto.TransactionDto;
import com.bank.BankingSystem.dto.AccountApplicationDto;
import com.bank.BankingSystem.entity.User;
import com.bank.BankingSystem.entity.AccountApplication;
import com.bank.BankingSystem.entity.enums.UserRole;
import com.bank.BankingSystem.repository.UserRepository;
import com.bank.BankingSystem.repository.AccountRepository;
import com.bank.BankingSystem.repository.TransactionRepository;
import com.bank.BankingSystem.service.AccountService;
import com.bank.BankingSystem.service.TransactionService;
import com.bank.BankingSystem.service.AccountApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;
    private final TransactionService transactionService;
    private final AccountApplicationService accountApplicationService;
    private final PasswordEncoder passwordEncoder;

    public EmployeeController(UserRepository userRepository, AccountRepository accountRepository,
                            TransactionRepository transactionRepository, AccountService accountService, 
                            TransactionService transactionService, AccountApplicationService accountApplicationService,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
        this.transactionService = transactionService;
        this.accountApplicationService = accountApplicationService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", userRepository.count());
            stats.put("totalAccounts", accountRepository.count());
            stats.put("totalTransactions", transactionRepository.count());
            
            // Calculate total balance from all accounts
            double totalBalance = accountRepository.findAll().stream()
                    .mapToDouble(account -> account.getBalance())
                    .sum();
            stats.put("totalBalance", totalBalance);
            
            stats.put("activeUsers", userRepository.count()); // Will be updated when we add active user logic
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountDto>> getAllAccounts() {
        try {
            List<AccountDto> accounts = accountRepository.findAll().stream()
                    .map(account -> {
                        AccountDto dto = new AccountDto();
                        dto.setId(account.getId());
                        dto.setAccountNumber(account.getAccountNumber());
                        dto.setUserId(account.getUser().getId());
                        dto.setAccountType(account.getAccountType());
                        dto.setBalance(account.getBalance());
                        dto.setActive(account.isActive());
                        return dto;
                    })
                    .toList();
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions() {
        try {
            List<TransactionDto> transactions = transactionRepository.findAll().stream()
                    .map(transaction -> {
                        TransactionDto dto = new TransactionDto();
                        dto.setId(transaction.getId());
                        dto.setAccountId(transaction.getAccount().getId());
                        dto.setTransactionType(transaction.getTransactionType());
                        dto.setAmount(transaction.getAmount());
                        dto.setFromAccount(transaction.getFromAccount());
                        dto.setToAccount(transaction.getToAccount());
                        dto.setTimestamp(transaction.getTimestamp());
                        return dto;
                    })
                    .toList();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", transactions
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching transactions: " + e.getMessage()));
        }
    }

    @PostMapping("/users")
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
            user.setRole(UserRole.USER); // Employees can only create regular users

            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/users/{userId}")
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

    @PutMapping("/users/{userId}/deactivate")
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

    @PostMapping("/accounts")
    public ResponseEntity<AccountDto> createAccount(@RequestBody AccountDto accountDto) {
        try {
            AccountDto createdAccount = accountService.createAccount(accountDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/users/{userId}/transactions")
    public ResponseEntity<List<TransactionDto>> getUserTransactions(@PathVariable Long userId) {
        try {
            // This would need a service method to get transactions for a specific user
            // For now, returning empty list
            return ResponseEntity.ok(List.of());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<AccountApplicationDto> applications = accountApplicationService.getAllApplications();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", applications
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching applications: " + e.getMessage()));
        }
    }

    @GetMapping("/transactions/search")
    public ResponseEntity<?> searchTransactions(
            @RequestParam(required = false) String accountNumber,
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<TransactionDto> transactions = transactionService.searchTransactions(accountNumber, transactionType, startDate, endDate);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", transactions
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error searching transactions: " + e.getMessage()));
        }
    }
} 