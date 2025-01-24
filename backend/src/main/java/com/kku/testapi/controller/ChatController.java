package com.kku.testapi.controller;

import com.kku.testapi.entity.ChatRoom;
import com.kku.testapi.entity.Message;
import com.kku.testapi.service.ChatServiceAction;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatServiceAction chatService;

    public ChatController(ChatServiceAction chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/room")
    public ResponseEntity<ChatRoom> getOrCreateChatRoom(@RequestParam Integer userOneId,
            @RequestParam Integer userTwoId) {
        ChatRoom chatRoom = chatService.getOrCreateChatRoom(userOneId, userTwoId);
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages(@RequestParam Integer chatRoomId) {
        System.out.println("Get messages in chat room: " + chatRoomId);
        List<Message> messages = chatService.getMessages(chatRoomId);
        System.out.println("Messages: " + messages);
        return ResponseEntity.ok(messages);
    }
}
