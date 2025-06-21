package com.bank.BankingSystem.dto;

import com.bank.BankingSystem.entity.enums.AccountType;
import lombok.Data;

@Data
public class AccountApplicationDto {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private AccountType accountType;
    private Double initialDeposit;
    private String purpose;
    private String status;
    private String employeeNotes;
    private String approvedBy;
    private String createdAt;
    private String updatedAt;
} 