package com.bank.BankingSystem.service.impl;

import com.bank.BankingSystem.dto.TransactionDto;
import com.bank.BankingSystem.dto.TransferRequestDto;
import com.bank.BankingSystem.entity.Account;
import com.bank.BankingSystem.entity.Transaction;
import com.bank.BankingSystem.entity.enums.TransactionType;
import com.bank.BankingSystem.repository.AccountRepository;
import com.bank.BankingSystem.repository.TransactionRepository;
import com.bank.BankingSystem.service.TransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public void transferFunds(TransferRequestDto transferRequestDto) {
        // 1. Find source and destination accounts
        Account fromAccount = accountRepository.findByAccountNumber(transferRequestDto.getFromAccountNumber())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account toAccount = accountRepository.findByAccountNumber(transferRequestDto.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        // 2. Check for sufficient balance
        if (fromAccount.getBalance() < transferRequestDto.getAmount()) {
            throw new RuntimeException("Insufficient funds");
        }

        // 3. Perform the debit and credit
        fromAccount.setBalance(fromAccount.getBalance() - transferRequestDto.getAmount());
        toAccount.setBalance(toAccount.getBalance() + transferRequestDto.getAmount());

        // 4. Save the updated account balances
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // 5. Log the transactions for both accounts
        Transaction debitTransaction = new Transaction(null, fromAccount, TransactionType.DEBIT, transferRequestDto.getAmount(), fromAccount.getAccountNumber(), toAccount.getAccountNumber(), null);
        Transaction creditTransaction = new Transaction(null, toAccount, TransactionType.CREDIT, transferRequestDto.getAmount(), fromAccount.getAccountNumber(), toAccount.getAccountNumber(), null);

        transactionRepository.save(debitTransaction);
        transactionRepository.save(creditTransaction);
    }

    @Override
    @Transactional
    public TransactionDto deposit(String accountNumber, Double amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Update account balance
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        // Create transaction record
        Transaction transaction = new Transaction(null, account, TransactionType.CREDIT, amount, null, accountNumber, null);
        Transaction savedTransaction = transactionRepository.save(transaction);

        return mapToDto(savedTransaction);
    }

    @Override
    @Transactional
    public TransactionDto withdraw(String accountNumber, Double amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Check for sufficient balance
        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient funds");
        }

        // Update account balance
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        // Create transaction record
        Transaction transaction = new Transaction(null, account, TransactionType.DEBIT, amount, accountNumber, null, null);
        Transaction savedTransaction = transactionRepository.save(transaction);

        return mapToDto(savedTransaction);
    }

    @Override
    public List<TransactionDto> getMiniStatement(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<Transaction> transactions = transactionRepository.findByAccountIdOrderByTimestampDesc(account.getId());

        return transactions.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDto> searchTransactions(String accountNumber, String transactionType, String startDate, String endDate) {
        List<Transaction> transactions;
        
        if (accountNumber != null && !accountNumber.trim().isEmpty()) {
            // Search by account number
            Account account = accountRepository.findByAccountNumber(accountNumber)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            transactions = transactionRepository.findByAccountIdOrderByTimestampDesc(account.getId());
        } else {
            // Get all transactions
            transactions = transactionRepository.findAll();
        }
        
        // Filter by transaction type if provided
        if (transactionType != null && !transactionType.trim().isEmpty()) {
            try {
                TransactionType type = TransactionType.valueOf(transactionType.toUpperCase());
                transactions = transactions.stream()
                        .filter(t -> t.getTransactionType() == type)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid transaction type, return empty list
                return List.of();
            }
        }
        
        // Filter by date range if provided
        if (startDate != null && !startDate.trim().isEmpty()) {
            try {
                java.time.LocalDate start = java.time.LocalDate.parse(startDate);
                transactions = transactions.stream()
                        .filter(t -> t.getTimestamp().toLocalDate().isAfter(start.minusDays(1)))
                        .collect(Collectors.toList());
            } catch (Exception e) {
                // Invalid date format, ignore this filter
            }
        }
        
        if (endDate != null && !endDate.trim().isEmpty()) {
            try {
                java.time.LocalDate end = java.time.LocalDate.parse(endDate);
                transactions = transactions.stream()
                        .filter(t -> t.getTimestamp().toLocalDate().isBefore(end.plusDays(1)))
                        .collect(Collectors.toList());
            } catch (Exception e) {
                // Invalid date format, ignore this filter
            }
        }
        
        return transactions.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private TransactionDto mapToDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setAccountId(transaction.getAccount().getId());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setAmount(transaction.getAmount());
        dto.setFromAccount(transaction.getFromAccount());
        dto.setToAccount(transaction.getToAccount());
        dto.setTimestamp(transaction.getTimestamp());
        return dto;
    }
} 