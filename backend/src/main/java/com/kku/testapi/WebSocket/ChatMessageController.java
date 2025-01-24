package com.kku.testapi.WebSocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.stereotype.Controller;

import com.kku.testapi.dto.MessageDto;
import com.kku.testapi.entity.ChatRoom;
import com.kku.testapi.entity.Message;
import com.kku.testapi.service.ChatServiceAction;

@Controller
public class ChatMessageController {
    private final ChatServiceAction chatService;

    public ChatMessageController(ChatServiceAction chatService) {
        this.chatService = chatService;
    }

    // WebSocket: ส่งข้อความใหม่และ Broadcast ให้ผู้ใช้ในห้อง
    @MessageMapping("/sendMessage/{chatRoomId}")
    @SendTo("/room/{chatRoomId}") // ส่งข้อความไปที่ /topic/room/{chatRoomId}
    public MessageDto sendMessage(@DestinationVariable String chatRoomId, MessageDto messageDto) {
        System.out.println("Message: " + messageDto.getContent() + " to room: " + chatRoomId);

        // ดึง ChatRoom ที่ตรงกับ chatRoomId
        ChatRoom chatRoom = chatService.getChatRoomById(Integer.parseInt(chatRoomId));

        // แปลง MessageDto เป็น Message
        Message message = new Message();
        message.setContent(messageDto.getContent());
        message.setChatRoom(chatRoom);
        message.setSender(chatService.getUserById(messageDto.getSenderId()));
        message.setTimestamp(new java.sql.Timestamp(System.currentTimeMillis()));

        System.out.println("Messagertrtrtrttrt: " + message.getContent() + " to room: " + chatRoom.getId());

        // บันทึกข้อความลงในฐานข้อมูล
        chatService.saveMessage(message);

        return messageDto;
    }
}