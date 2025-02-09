package com.kku.testapi.service;

import com.kku.testapi.dto.PostResponseDTO;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.Share;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.ShareRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShareService {

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private PostService postService; // Inject PostService

    @Autowired
    private NotificationServiceAction notificationServiceAction; // Inject NotificationService

    @Autowired
    private UserService userService; // ✅ Inject UserService

    // ✅ ดึงโพสต์ทั้งหมดที่ถูกแชร์โดยผู้ใช้งาน
    public List<PostResponseDTO> getSharedPostsByUser(User user) {
        List<Share> sharedPosts = shareRepository.findByUser(user);

        return sharedPosts.stream()
                .map(share -> convertToPostResponseDTO(postService.getPostById(share.getPost().getId()))) // ✅ ใช้ `convertToPostResponseDTO`
                .collect(Collectors.toList());
    }

    // ✅ เพิ่มการแชร์โพสต์
    @Transactional
    public Share sharePost(User user, Post post) {
        Share share = new Share();
        share.setUser(user);
        share.setPost(post);
        Share savedShare = shareRepository.save(share);

        // ✅ ส่งการแจ้งเตือนเมื่อแชร์โพสต์
        if (!post.getUser().getId().equals(user.getId())) { // หากผู้แชร์โพสต์ไม่ใช่เจ้าของโพสต์
            notificationServiceAction.sendShareNotification(user, post.getUser(), post.getId()); // ส่งการแจ้งเตือน
        }

        return savedShare; // คืนค่า Share ที่ถูกบันทึก
    }

    // ✅ ลบ Share ตาม ID
    public void deleteShare(Integer shareId) {
        if (!shareRepository.existsById(shareId)) {
            throw new IllegalArgumentException("Share not found with ID: " + shareId);
        }
        shareRepository.deleteById(shareId);
    }

    // ✅ แปลง `PostResponseDTO` ให้มี User ที่แปลงเป็น Base64 แล้ว
    private PostResponseDTO convertToPostResponseDTO(PostResponseDTO postDTO) {
        User userWithBase64 = userService.getUserWithBase64Images(postDTO.getUser().getId());

        return new PostResponseDTO(
                postDTO.getId(),
                postDTO.getContent(),
                userWithBase64, // ✅ ใช้ User ที่แปลงแล้ว
                postDTO.getTimestamp(),
                postDTO.getLikeAmount(),
                postDTO.getCommentAmount(),
                postDTO.getShareAmount()
        );
    }
}
