package com.bank.BankingSystem.repository;

import com.bank.BankingSystem.entity.AccountApplication;
import com.bank.BankingSystem.entity.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountApplicationRepository extends JpaRepository<AccountApplication, Long> {
    
    List<AccountApplication> findByStatus(ApplicationStatus status);
    
    List<AccountApplication> findByUserId(Long userId);
    
    List<AccountApplication> findByUserIdAndStatus(Long userId, ApplicationStatus status);
} 