package com.bank.BankingSystem.dto;

import com.bank.BankingSystem.entity.enums.AccountType;
import lombok.Data;

@Data
public class AccountDto {
    private Long id;
    private String accountNumber;
    private Long userId;
    private AccountType accountType;
    private Double balance;
    private boolean isActive;
}