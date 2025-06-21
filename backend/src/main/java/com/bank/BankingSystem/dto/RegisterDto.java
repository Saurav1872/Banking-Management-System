package com.bank.BankingSystem.dto;

import lombok.Data;

@Data
public class RegisterDto {
    private String fullName;
    private String email;
    private String phone;
    private String password;
} 