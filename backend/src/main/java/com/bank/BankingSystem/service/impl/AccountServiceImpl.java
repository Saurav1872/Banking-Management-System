package com.bank.BankingSystem.service.impl;

import com.bank.BankingSystem.dto.AccountDto;
import com.bank.BankingSystem.entity.Account;
import com.bank.BankingSystem.entity.User;
import com.bank.BankingSystem.entity.enums.AccountType;
import com.bank.BankingSystem.repository.AccountRepository;
import com.bank.BankingSystem.repository.UserRepository;
import com.bank.BankingSystem.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AccountDto createAccount(AccountDto accountDto) {
        User user = userRepository.findById(accountDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setUser(user);
        account.setAccountType(accountDto.getAccountType());
        account.setBalance(accountDto.getBalance() != null ? accountDto.getBalance() : 0.00);
        
        String accountNumber;
        do {
            accountNumber = generateAccountNumber();
        } while (accountRepository.findByAccountNumber(accountNumber).isPresent());
        account.setAccountNumber(accountNumber);

        Account savedAccount = accountRepository.save(account);

        return mapToDto(savedAccount);
    }

    @Override
    public AccountDto createAccount(Long userId, AccountType accountType, Double initialDeposit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setUser(user);
        account.setAccountType(accountType);
        account.setBalance(initialDeposit != null ? initialDeposit : 0.00);
        
        String accountNumber;
        do {
            accountNumber = generateAccountNumber();
        } while (accountRepository.findByAccountNumber(accountNumber).isPresent());
        account.setAccountNumber(accountNumber);

        Account savedAccount = accountRepository.save(account);

        return mapToDto(savedAccount);
    }

    @Override
    public AccountDto getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return mapToDto(account);
    }

    @Override
    public List<AccountDto> getAccountsByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Account> accounts = accountRepository.findByUserId(user.getId());
        return accounts.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDto updateAccount(String accountNumber, AccountDto accountDto) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        // Update only allowed fields
        if (accountDto.getBalance() != null) {
            account.setBalance(accountDto.getBalance());
        }
        if (accountDto.isActive() != account.isActive()) {
            account.setActive(accountDto.isActive());
        }
        
        Account updatedAccount = accountRepository.save(account);
        return mapToDto(updatedAccount);
    }

    private String generateAccountNumber() {
        return String.valueOf((long) (Math.random() * 9_000_000_000L) + 1_000_000_000L);
    }

    private AccountDto mapToDto(Account account) {
        AccountDto dto = new AccountDto();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setUserId(account.getUser().getId());
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setActive(account.isActive());
        return dto;
    }
}