package com.kku.testapi.service;

import com.kku.testapi.entity.NotificationType;
import com.kku.testapi.entity.User;

public interface NotificationService {
    public void createNotification(User sender, User receiver, NotificationType type, Integer contentId, String message);
    public void sendLikeNotification(User sender, User receiver, Integer postId);
    public void sendShareNotification(User sender, User receiver, Integer postId);
    public void sendCommentNotification(User sender, User receiver, Integer postId);
    public void sendMessageNotification(User sender, User receiver, Integer messageId);

}
