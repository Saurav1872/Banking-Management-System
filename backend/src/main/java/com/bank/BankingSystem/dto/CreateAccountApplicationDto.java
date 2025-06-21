package com.bank.BankingSystem.dto;

import com.bank.BankingSystem.entity.enums.AccountType;
import lombok.Data;

@Data
public class CreateAccountApplicationDto {
    private AccountType accountType;
    private Double initialDeposit;
    private String purpose;
} 