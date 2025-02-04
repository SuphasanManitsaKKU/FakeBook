package com.kku.testapi.controller;

import com.kku.testapi.entity.FriendRequest;
import com.kku.testapi.service.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friend-requests")
public class FriendRequestController {

    @Autowired
    private FriendRequestService friendRequestService;

    // ✅ ส่งคำขอเป็นเพื่อน
    @PostMapping("/send")
    public ResponseEntity<FriendRequest> sendFriendRequest(
            @RequestParam Integer senderId, @RequestParam Integer receiverId) {
        return ResponseEntity.ok(friendRequestService.sendFriendRequest(senderId, receiverId));
    }

    // ✅ ยอมรับคำขอเป็นเพื่อน
    @PostMapping("/accept")
    public ResponseEntity<FriendRequest> acceptFriendRequest(@RequestParam Integer requestId) {
        return ResponseEntity.ok(friendRequestService.acceptFriendRequest(requestId));
    }

    // ✅ ปฏิเสธคำขอเป็นเพื่อน
    @PostMapping("/reject")
    public ResponseEntity<FriendRequest> rejectFriendRequest(@RequestParam Integer requestId) {
        return ResponseEntity.ok(friendRequestService.rejectFriendRequest(requestId));
    }

    // ✅ ยกเลิกคำขอเป็นเพื่อน
    @DeleteMapping("/cancel")
    public ResponseEntity<String> cancelFriendRequest(@RequestParam Integer requestId) {
        friendRequestService.cancelFriendRequest(requestId);
        return ResponseEntity.ok("Friend request canceled successfully.");
    }

    // ✅ ดูคำขอที่เราส่งไปแล้ว แต่ยังไม่ได้รับการตอบรับ
    @GetMapping("/sent-pending")
    public ResponseEntity<List<FriendRequest>> getSentPendingRequests(@RequestParam Integer userId) {
        return ResponseEntity.ok(friendRequestService.getSentPendingRequests(userId));
    }

    // ✅ ดูคำขอที่เพื่อนส่งมาให้เรา แต่เรายังไม่ได้ตอบรับ
    @GetMapping("/received-pending")
    public ResponseEntity<List<FriendRequest>> getReceivedPendingRequests(@RequestParam Integer userId) {
        return ResponseEntity.ok(friendRequestService.getReceivedPendingRequests(userId));
    }
}
