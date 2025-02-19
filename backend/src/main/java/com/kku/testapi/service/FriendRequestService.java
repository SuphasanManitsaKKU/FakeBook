package com.kku.testapi.service;

import com.kku.testapi.entity.FriendRequest;
import com.kku.testapi.entity.RequestStatus;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.FriendRequestRepository;
import com.kku.testapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendService friendService;

    @Autowired
    private UserService userService; // ✅ Inject UserService

    // ✅ ส่งคำขอเป็นเพื่อน
    @Transactional
    public FriendRequest sendFriendRequest(Integer senderId, Integer receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        if (friendRequestRepository.existsBySenderAndReceiverAndStatus(sender, receiver, RequestStatus.PENDING)) {
            throw new IllegalStateException("Friend request already sent.");
        }

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(RequestStatus.PENDING);

        return friendRequestRepository.save(request);
    }

    // ✅ ยอมรับคำขอเป็นเพื่อน
    @Transactional
    public FriendRequest acceptFriendRequest(Integer requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        request.setStatus(RequestStatus.ACCEPTED);
        friendRequestRepository.save(request);

        // ✅ เพิ่มลงใน `Friend` Table
        friendService.addFriend(request.getSender(), request.getReceiver());

        return request;
    }

    // ✅ ปฏิเสธคำขอเป็นเพื่อน
    @Transactional
    public FriendRequest rejectFriendRequest(Integer requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        request.setStatus(RequestStatus.DECLINED);
        return friendRequestRepository.save(request);
    }

    // ✅ ยกเลิกคำขอเป็นเพื่อน
    @Transactional
    public void cancelFriendRequest(Integer requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Cannot cancel a processed request.");
        }

        friendRequestRepository.delete(request);
    }

    // ✅ ดึงคำขอที่เราส่งไปแล้ว แต่ยังไม่ได้รับการตอบรับ
    public List<FriendRequest> getSentPendingRequests(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return friendRequestRepository.findBySenderAndStatus(user, RequestStatus.PENDING)
                .stream()
                .map(this::convertFriendRequestToBase64)
                .collect(Collectors.toList());
    }

    // ✅ ดึงคำขอที่เพื่อนส่งมาให้เรา แต่เรายังไม่ได้ตอบรับ
    public List<FriendRequest> getReceivedPendingRequests(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return friendRequestRepository.findByReceiverAndStatus(user, RequestStatus.PENDING)
                .stream()
                .map(this::convertFriendRequestToBase64)
                .collect(Collectors.toList());
    }

    // ✅ แปลง `FriendRequest` ให้ Sender และ Receiver มี Base64 Image
    private FriendRequest convertFriendRequestToBase64(FriendRequest request) {
        request.setSender(userService.getUserWithBase64Images(request.getSender().getId()));
        request.setReceiver(userService.getUserWithBase64Images(request.getReceiver().getId()));
        return request;
    }
}
