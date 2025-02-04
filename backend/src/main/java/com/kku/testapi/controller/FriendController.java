package com.kku.testapi.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kku.testapi.entity.User;
import com.kku.testapi.service.FriendServiceAction;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendServiceAction friendService;

    // ดึงรายการเพื่อนทั้งหมด
    @GetMapping("/getAllFriends")
    public ResponseEntity<List<User>> getAllFriends(@RequestParam Integer userId) {
        List<User> users = friendService.findFriendsByUserId(userId);
        return ResponseEntity.ok(users);
    }

    // ลบเพื่อน
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFriend(@RequestParam Integer userId, @RequestParam Integer friendId) {
        friendService.removeFriend(userId, friendId);
        return ResponseEntity.ok("Friend removed successfully.");
    }
}
