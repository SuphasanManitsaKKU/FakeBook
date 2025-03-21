package com.kku.testapi.service;

import com.kku.testapi.dto.NotificationRequestDto;
import com.kku.testapi.entity.Notification;
import com.kku.testapi.entity.NotificationType;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.NotificationRepository;

import java.util.List;
import java.util.stream.Collectors;

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
    public void createNotification(User sender, User receiver, NotificationType type, Integer contentId,
            String message) {
        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setReceiver(receiver);
        notification.setType(type);
        notification.setContentId(contentId);
        notification.setStatus((byte) 0); // กำหนดสถานะเริ่มต้นเป็น 0 (ยังไม่อ่าน)

        // ✅ บันทึกการแจ้งเตือนลงในฐานข้อมูล และให้ JPA กำหนด ID อัตโนมัติ
        Notification savedNotification = notificationRepository.save(notification);

        // ✅ สร้าง DTO และใส่ notificationId ที่ได้จากฐานข้อมูล
        NotificationRequestDto notificationRequest = new NotificationRequestDto();
        notificationRequest.setUserId(receiver.getId().toString());
        notificationRequest.setNotificationId(savedNotification.getId()); // ✅ ใส่ notificationId
        notificationRequest.setMessage(message);
        notificationRequest.setType(type.name());
        notificationRequest.setContentId(contentId);
        notificationRequest.setStatus((byte) 0); // ✅ ใส่ค่า status 0 (ยังไม่อ่าน)

        // ✅ ส่งข้อความผ่าน WebSocket พร้อมกับ notificationId
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

    public List<NotificationRequestDto> getNotificationsByUserId(Integer userId) {
        List<Notification> notifications = notificationRepository.findByReceiverIdOrderByIdDesc(userId);

        return notifications.stream().map(notification -> {
            NotificationRequestDto dto = new NotificationRequestDto();
            dto.setNotificationId(notification.getId()); // ✅ เพิ่ม notificationId
            dto.setUserId(notification.getReceiver().getId().toString());
            dto.setMessage(generateMessage(notification));
            dto.setType(notification.getType().name());
            dto.setContentId(notification.getContentId());
            dto.setStatus(notification.getStatus()); // ✅ คง status เป็น Byte
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * สร้างข้อความแจ้งเตือนตามประเภทของ Notification
     */
    private String generateMessage(Notification notification) {
        String senderName = notification.getSender().getUsername();
        switch (notification.getType()) {
            case LIKE:
                return senderName + " liked your post.";
            case SHARE:
                return senderName + " shared your post.";
            case COMMENT:
                return senderName + " commented on your post.";
            case SENT_MESSAGE:
                return senderName + " sent you a message.";
            default:
                return "You have a new notification.";
        }
    }

    public void markAsRead(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId).get();
        notification.setStatus((byte) 1); // กำหนดสถานะการแจ้งเตือนว่าได้รับการดูแล้ว (1)
        notificationRepository.save(notification);
    }
}
