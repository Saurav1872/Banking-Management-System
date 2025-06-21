package com.bank.BankingSystem.service.impl;

import com.bank.BankingSystem.dto.AccountApplicationDto;
import com.bank.BankingSystem.dto.CreateAccountApplicationDto;
import com.bank.BankingSystem.dto.ApplicationDecisionDto;
import com.bank.BankingSystem.entity.AccountApplication;
import com.bank.BankingSystem.entity.User;
import com.bank.BankingSystem.entity.enums.ApplicationStatus;
import com.bank.BankingSystem.repository.AccountApplicationRepository;
import com.bank.BankingSystem.repository.UserRepository;
import com.bank.BankingSystem.service.AccountApplicationService;
import com.bank.BankingSystem.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountApplicationServiceImpl implements AccountApplicationService {

    @Autowired
    private AccountApplicationRepository accountApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountService accountService;

    @Override
    @Transactional
    public AccountApplicationDto createApplication(CreateAccountApplicationDto request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AccountApplication application = new AccountApplication();
        application.setUser(user);
        application.setAccountType(request.getAccountType());
        application.setInitialDeposit(request.getInitialDeposit());
        application.setPurpose(request.getPurpose());
        application.setStatus(ApplicationStatus.PENDING);

        AccountApplication savedApplication = accountApplicationRepository.save(application);
        return convertToDto(savedApplication);
    }

    @Override
    public List<AccountApplicationDto> getAllApplications() {
        return accountApplicationRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccountApplicationDto> getPendingApplications() {
        return accountApplicationRepository.findByStatus(ApplicationStatus.PENDING).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccountApplicationDto> getUserApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return accountApplicationRepository.findByUserId(user.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AccountApplicationDto processApplication(ApplicationDecisionDto decision, String employeeEmail) {
        User employee = userRepository.findByEmail(employeeEmail)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        AccountApplication application = accountApplicationRepository.findById(decision.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new RuntimeException("Application has already been processed");
        }

        ApplicationStatus newStatus = ApplicationStatus.valueOf(decision.getDecision().toUpperCase());
        application.setStatus(newStatus);
        application.setEmployeeNotes(decision.getNotes());
        application.setApprovedBy(employee);

        // If approved, create the account
        if (newStatus == ApplicationStatus.APPROVED) {
            accountService.createAccount(
                application.getUser().getId(),
                application.getAccountType(),
                application.getInitialDeposit()
            );
        }

        AccountApplication savedApplication = accountApplicationRepository.save(application);
        return convertToDto(savedApplication);
    }

    @Override
    public AccountApplicationDto getApplicationById(Long applicationId) {
        AccountApplication application = accountApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return convertToDto(application);
    }

    private AccountApplicationDto convertToDto(AccountApplication application) {
        AccountApplicationDto dto = new AccountApplicationDto();
        dto.setId(application.getId());
        dto.setUserId(application.getUser().getId());
        dto.setUserEmail(application.getUser().getEmail());
        dto.setUserName(application.getUser().getFullName());
        dto.setAccountType(application.getAccountType());
        dto.setInitialDeposit(application.getInitialDeposit());
        dto.setPurpose(application.getPurpose());
        dto.setStatus(application.getStatus().name());
        dto.setEmployeeNotes(application.getEmployeeNotes());
        
        if (application.getApprovedBy() != null) {
            dto.setApprovedBy(application.getApprovedBy().getFullName());
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        dto.setCreatedAt(application.getCreatedAt().format(formatter));
        
        if (application.getUpdatedAt() != null) {
            dto.setUpdatedAt(application.getUpdatedAt().format(formatter));
        }
        
        return dto;
    }
} 