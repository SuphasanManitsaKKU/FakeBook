package com.kku.testapi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kku.testapi.entity.Friend;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.FriendRepository;
import com.kku.testapi.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class FriendServiceAction implements FriendService {

    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private UserRepository userRepository;

    // ดึงรายชื่อเพื่อนทั้งหมดของผู้ใช้
    @Override
    // ดึงรายชื่อเพื่อนทั้งหมดของผู้ใช้
    public List<User> findFriendsByUserId(Integer userId) {
        // ดึง Friend ทั้งหมดที่มี userId เป็น userOne หรือ userTwo
        List<Friend> friends = friendRepository.findByUserOneIdOrUserTwoId(userId, userId);

        // แปลงจาก Friend ไปเป็น List<User> โดยเลือก userOne หรือ userTwo ที่ไม่ใช่
        // userId
        return friends.stream()
                .map(friend -> {
                    // เลือกผู้ใช้ที่ไม่ใช่ userId
                    if (friend.getUserOne().getId().equals(userId)) {
                        return friend.getUserTwo(); // คืนค่า userTwo
                    } else {
                        return friend.getUserOne(); // คืนค่า userOne
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void addFriend(User userOne, User userTwo) {
        if (!friendRepository.existsByUserOneAndUserTwo(userOne, userTwo) &&
                !friendRepository.existsByUserOneAndUserTwo(userTwo, userOne)) {

            Friend friend = new Friend();
            friend.setUserOne(userOne);
            friend.setUserTwo(userTwo);
            friendRepository.save(friend);
        }
    }

    // ✅ ลบเพื่อน
    @Transactional
    public void removeFriend(Integer userId, Integer friendId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new IllegalArgumentException("Friend not found"));

        Friend friendship = friendRepository
                .findFriendship(user, friend)
                .orElseThrow(() -> new IllegalArgumentException("Friendship not found"));

        friendRepository.delete(friendship);
    }
}