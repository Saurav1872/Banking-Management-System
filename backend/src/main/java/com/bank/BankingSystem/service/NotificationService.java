package com.bank.BankingSystem.service;

import com.bank.BankingSystem.model.Notification;
import java.util.List;

public interface NotificationService {
    void createNotification(Long userId, String message);
    List<Notification> getUserNotifications(Long userId);
    List<Notification> getNotificationsByUserEmail(String email);
    void markAsRead(String notificationId);
    void deleteNotification(String notificationId);
} 