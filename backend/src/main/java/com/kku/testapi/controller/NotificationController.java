package com.kku.testapi.controller;

import com.kku.testapi.dto.NotificationRequestDto;
import com.kku.testapi.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{userId}")
    public List<NotificationRequestDto> getNotifications(@PathVariable Integer userId) {
        return notificationService.getNotificationsByUserId(userId);
    }

    @PutMapping("/{notificationId}")
    public void markAsRead(@PathVariable Integer notificationId) {
        notificationService.markAsRead(notificationId);
    }
}
