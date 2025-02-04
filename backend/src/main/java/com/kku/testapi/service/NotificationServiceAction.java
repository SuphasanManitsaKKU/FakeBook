package com.kku.testapi.service;

import com.kku.testapi.dto.NotificationRequestDto;
import com.kku.testapi.entity.Notification;
import com.kku.testapi.entity.NotificationType;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceAction implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // ฟังก์ชันสร้างการแจ้งเตือน
    public void createNotification(User sender, User receiver, NotificationType type, Integer contentId, String message) {
        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setReceiver(receiver);
        notification.setType(type);
        notification.setContentId(contentId);
        notification.setStatus((byte) 0);  // กำหนดสถานะการแจ้งเตือนว่าไม่ได้รับการดู (0)

        // บันทึกการแจ้งเตือนในฐานข้อมูล
        notificationRepository.save(notification);

        // ส่งข้อความผ่าน WebSocket หรือช่องทางอื่นๆ
        NotificationRequestDto notificationRequest = new NotificationRequestDto();
        notificationRequest.setUserId(receiver.getId().toString());
        notificationRequest.setMessage(message);
        notificationRequest.setType(type.name()); // ตั้งค่า type ด้วย NotificationType

        messagingTemplate.convertAndSend("/notification/messages/" + receiver.getId(), notificationRequest);
    }

    // ฟังก์ชันสำหรับ LIKE
    public void sendLikeNotification(User sender, User receiver, Integer postId) {
        String message = sender.getUsername() + " liked your post.";
        createNotification(sender, receiver, NotificationType.LIKE, postId, message);
    }

    // ฟังก์ชันสำหรับ SHARE
    public void sendShareNotification(User sender, User receiver, Integer postId) {
        String message = sender.getUsername() + " shared your post.";
        createNotification(sender, receiver, NotificationType.SHARE, postId, message);
    }

    // ฟังก์ชันสำหรับ COMMENT
    public void sendCommentNotification(User sender, User receiver, Integer postId) {
        String message = sender.getUsername() + " commented on your post.";
        createNotification(sender, receiver, NotificationType.COMMENT, postId, message);
    }

    // ฟังก์ชันสำหรับ SENT_MESSAGE
    public void sendMessageNotification(User sender, User receiver, Integer messageId) {
        String message = sender.getUsername() + " sent you a message.";
        createNotification(sender, receiver, NotificationType.SENT_MESSAGE, messageId, message);
    }
}
