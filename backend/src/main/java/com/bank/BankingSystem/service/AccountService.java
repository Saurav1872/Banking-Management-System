package com.bank.BankingSystem.service;

import com.bank.BankingSystem.dto.AccountDto;
import com.bank.BankingSystem.entity.enums.AccountType;

import java.util.List;

public interface AccountService {
    AccountDto createAccount(AccountDto accountDto);
    AccountDto createAccount(Long userId, AccountType accountType, Double initialDeposit);
    AccountDto getAccountByNumber(String accountNumber);
    List<AccountDto> getAccountsByUserEmail(String email);
    AccountDto updateAccount(String accountNumber, AccountDto accountDto);
}