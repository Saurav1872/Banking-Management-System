package com.bank.BankingSystem.dto;

import lombok.Data;

@Data
public class ApplicationDecisionDto {
    private Long applicationId;
    private String decision; // "APPROVED" or "REJECTED"
    private String notes;
} 