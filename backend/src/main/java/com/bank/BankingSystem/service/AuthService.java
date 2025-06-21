package com.bank.BankingSystem.service;

import com.bank.BankingSystem.dto.LoginDto;
import com.bank.BankingSystem.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);
    String login(LoginDto loginDto);
} 