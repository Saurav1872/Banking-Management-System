package com.bank.BankingSystem.service;

import com.bank.BankingSystem.dto.TransactionDto;
import com.bank.BankingSystem.dto.TransferRequestDto;
import java.util.List;

public interface TransactionService {
    void transferFunds(TransferRequestDto transferRequestDto);
    List<TransactionDto> getMiniStatement(String accountNumber);
    TransactionDto deposit(String accountNumber, Double amount);
    TransactionDto withdraw(String accountNumber, Double amount);
    List<TransactionDto> searchTransactions(String accountNumber, String transactionType, String startDate, String endDate);
} 