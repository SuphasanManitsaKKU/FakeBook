package com.kku.testapi.service;

import java.util.List;

import com.kku.testapi.dto.NotificationRequestDto;
import com.kku.testapi.entity.Notification;
import com.kku.testapi.entity.NotificationType;
import com.kku.testapi.entity.User;

public interface NotificationService {
    public void createNotification(User sender, User receiver, NotificationType type, Integer contentId,
            String message);

    public void sendLikeNotification(User sender, User receiver, Integer postId);

    public void sendShareNotification(User sender, User receiver, Integer postId);

    public void sendCommentNotification(User sender, User receiver, Integer postId);

    public void sendMessageNotification(User sender, User receiver, Integer messageId);

    public List<NotificationRequestDto> getNotificationsByUserId(Integer userId);

    public void markAsRead(Integer notificationId);


}
