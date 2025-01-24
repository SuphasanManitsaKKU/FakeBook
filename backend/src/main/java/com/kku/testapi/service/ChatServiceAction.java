package com.kku.testapi.service;

import com.kku.testapi.entity.ChatRoom;
import com.kku.testapi.entity.Message;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.ChatRoomRepository;
import com.kku.testapi.repository.MessageRepository;
import com.kku.testapi.repository.UserRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ChatServiceAction implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatServiceAction(ChatRoomRepository chatRoomRepository, MessageRepository messageRepository,
            UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public ChatRoom getOrCreateChatRoom(Integer userOneId, Integer userTwoId) {
        return chatRoomRepository.findByUserIds(userOneId, userTwoId)
                .orElseGet(() -> {
                    User userOne = userRepository.findById(userOneId)
                            .orElseThrow(() -> new IllegalArgumentException("UserOne not found"));
                    User userTwo = userRepository.findById(userTwoId)
                            .orElseThrow(() -> new IllegalArgumentException("UserTwo not found"));
                    ChatRoom chatRoom = new ChatRoom(userOne, userTwo);
                    return chatRoomRepository.save(chatRoom);
                });
    }
    

    public User getUserById(Integer userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<Message> getMessages(Integer chatRoomId) {
        return messageRepository.findByChatRoomId(chatRoomId); // ดึงข้อความทั้งหมดใน ChatRoom
    }

    public Message sendMessage(Integer chatRoomId, Integer senderId, String content) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("ChatRoom not found"));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        Message message = new Message(chatRoom, sender, content);
        return messageRepository.save(message); // บันทึกข้อความและส่งกลับ
    }

    public void saveMessage(Message message) {
        messageRepository.save(message); // บันทึกข้อความลงฐานข้อมูล
    }

    public ChatRoom getChatRoomById(Integer chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("ChatRoom not found"));
    }

}
