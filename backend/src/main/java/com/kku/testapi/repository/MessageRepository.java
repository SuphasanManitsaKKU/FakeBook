package com.kku.testapi.repository;

import com.kku.testapi.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByChatRoomId(Integer chatRoomId); // ค้นหาข้อความทั้งหมดในห้องแชท
}
