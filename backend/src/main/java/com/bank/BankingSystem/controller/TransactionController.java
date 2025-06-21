package com.bank.BankingSystem.controller;

import com.bank.BankingSystem.dto.TransactionDto;
import com.bank.BankingSystem.dto.TransferRequestDto;
import com.bank.BankingSystem.service.TransactionService;
import com.bank.BankingSystem.service.NotificationService;
import com.bank.BankingSystem.repository.AccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final NotificationService notificationService;
    private final AccountRepository accountRepository;

    public TransactionController(TransactionService transactionService, NotificationService notificationService, AccountRepository accountRepository) {
        this.transactionService = transactionService;
        this.notificationService = notificationService;
        this.accountRepository = accountRepository;
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferFunds(@RequestBody TransferRequestDto transferRequestDto) {
        try {
            transactionService.transferFunds(transferRequestDto);
            // Fetch sender and receiver userIds
            Long senderUserId = accountRepository.findByAccountNumber(transferRequestDto.getFromAccountNumber())
                .map(acc -> acc.getUser().getId()).orElse(null);
            Long receiverUserId = accountRepository.findByAccountNumber(transferRequestDto.getToAccountNumber())
                .map(acc -> acc.getUser().getId()).orElse(null);
            // Notify both sender and receiver
            if (senderUserId != null) {
                notificationService.createNotification(
                    senderUserId,
                    "Amount " + transferRequestDto.getAmount() + " transferred from " + transferRequestDto.getFromAccountNumber() + " to " + transferRequestDto.getToAccountNumber()
                );
            }
            if (receiverUserId != null) {
                notificationService.createNotification(
                    receiverUserId,
                    "Amount " + transferRequestDto.getAmount() + " received in account " + transferRequestDto.getToAccountNumber() + " from " + transferRequestDto.getFromAccountNumber()
                );
            }
            return ResponseEntity.ok("Transfer successful");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionDto> deposit(@RequestBody DepositRequest depositRequest) {
        try {
            TransactionDto transaction = transactionService.deposit(depositRequest.getAccountNumber(), depositRequest.getAmount());
            
            // Notify user about deposit
            Long userId = accountRepository.findByAccountNumber(depositRequest.getAccountNumber())
                .map(acc -> acc.getUser().getId()).orElse(null);
            if (userId != null) {
                notificationService.createNotification(
                    userId,
                    "Amount " + depositRequest.getAmount() + " deposited to account " + depositRequest.getAccountNumber()
                );
            }
            
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionDto> withdraw(@RequestBody WithdrawRequest withdrawRequest) {
        try {
            TransactionDto transaction = transactionService.withdraw(withdrawRequest.getAccountNumber(), withdrawRequest.getAmount());
            
            // Notify user about withdrawal
            Long userId = accountRepository.findByAccountNumber(withdrawRequest.getAccountNumber())
                .map(acc -> acc.getUser().getId()).orElse(null);
            if (userId != null) {
                notificationService.createNotification(
                    userId,
                    "Amount " + withdrawRequest.getAmount() + " withdrawn from account " + withdrawRequest.getAccountNumber()
                );
            }
            
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/mini-statement/{accountNumber}")
    public ResponseEntity<List<TransactionDto>> getMiniStatement(@PathVariable String accountNumber) {
        try {
            List<TransactionDto> transactions = transactionService.getMiniStatement(accountNumber);
            return ResponseEntity.ok(transactions);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<List<TransactionDto>> getTransactionsByAccount(@PathVariable String accountNumber) {
        try {
            List<TransactionDto> transactions = transactionService.getMiniStatement(accountNumber);
            return ResponseEntity.ok(transactions);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Inner classes for request bodies
    public static class DepositRequest {
        private String accountNumber;
        private Double amount;

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }

    public static class WithdrawRequest {
        private String accountNumber;
        private Double amount;

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }
} 