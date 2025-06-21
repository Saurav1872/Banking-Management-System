package com.bank.BankingSystem.service;

import com.bank.BankingSystem.dto.AccountApplicationDto;
import com.bank.BankingSystem.dto.CreateAccountApplicationDto;
import com.bank.BankingSystem.dto.ApplicationDecisionDto;

import java.util.List;

public interface AccountApplicationService {
    
    AccountApplicationDto createApplication(CreateAccountApplicationDto request, String userEmail);
    
    List<AccountApplicationDto> getAllApplications();
    
    List<AccountApplicationDto> getPendingApplications();
    
    List<AccountApplicationDto> getUserApplications(String userEmail);
    
    AccountApplicationDto processApplication(ApplicationDecisionDto decision, String employeeEmail);
    
    AccountApplicationDto getApplicationById(Long applicationId);
} 