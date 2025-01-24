package com.kku.testapi.service;

import com.kku.testapi.entity.ChatRoom;
import com.kku.testapi.entity.Message;
import com.kku.testapi.entity.User;

public interface ChatService {
    ChatRoom getOrCreateChatRoom(Integer userOneId, Integer userTwoId);
    User getUserById(Integer userId);
    void saveMessage(Message message);
    ChatRoom getChatRoomById(Integer chatRoomId);
}
