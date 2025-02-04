package com.kku.testapi.repository;

import com.kku.testapi.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // ค้นหาการแจ้งเตือนตามผู้รับ
    List<Notification> findByReceiverId(Integer receiverId);

    // ค้นหาการแจ้งเตือนตามประเภท
    List<Notification> findByType(String type);

    // ค้นหาการแจ้งเตือนที่ยังไม่ได้ดู (status == 0)
    List<Notification> findByStatus(Byte status);

    // ค้นหาการแจ้งเตือนโดยผู้ส่งและผู้รับ
    List<Notification> findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

}
