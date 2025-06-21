package com.bank.BankingSystem.dto;

import com.bank.BankingSystem.entity.enums.TransactionType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionDto {
    private Long id;
    private Long accountId;
    private TransactionType transactionType;
    private Double amount;
    private String fromAccount;
    private String toAccount;
    private LocalDateTime timestamp;
} 