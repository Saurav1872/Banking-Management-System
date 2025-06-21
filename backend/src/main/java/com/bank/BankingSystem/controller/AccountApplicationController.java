package com.bank.BankingSystem.controller;

import com.bank.BankingSystem.dto.AccountApplicationDto;
import com.bank.BankingSystem.dto.CreateAccountApplicationDto;
import com.bank.BankingSystem.dto.ApplicationDecisionDto;
import com.bank.BankingSystem.service.AccountApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class AccountApplicationController {

    @Autowired
    private AccountApplicationService accountApplicationService;

    @PostMapping
    public ResponseEntity<AccountApplicationDto> createApplication(@RequestBody CreateAccountApplicationDto request) {
        String userEmail = getCurrentUserEmail();
        AccountApplicationDto application = accountApplicationService.createApplication(request, userEmail);
        return ResponseEntity.ok(application);
    }

    @GetMapping
    public ResponseEntity<List<AccountApplicationDto>> getAllApplications() {
        List<AccountApplicationDto> applications = accountApplicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<AccountApplicationDto>> getPendingApplications() {
        List<AccountApplicationDto> applications = accountApplicationService.getPendingApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<AccountApplicationDto>> getMyApplications() {
        String userEmail = getCurrentUserEmail();
        List<AccountApplicationDto> applications = accountApplicationService.getUserApplications(userEmail);
        return ResponseEntity.ok(applications);
    }

    @PostMapping("/process")
    public ResponseEntity<AccountApplicationDto> processApplication(@RequestBody ApplicationDecisionDto decision) {
        String employeeEmail = getCurrentUserEmail();
        AccountApplicationDto application = accountApplicationService.processApplication(decision, employeeEmail);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountApplicationDto> getApplicationById(@PathVariable Long id) {
        AccountApplicationDto application = accountApplicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
} 