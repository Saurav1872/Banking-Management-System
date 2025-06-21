package com.bank.BankingSystem.dto;

import lombok.Data;

@Data
public class TransferRequestDto {
    private String fromAccountNumber;
    private String toAccountNumber;
    private Double amount;
} 