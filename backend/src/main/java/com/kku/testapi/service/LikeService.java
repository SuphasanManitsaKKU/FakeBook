package com.kku.testapi.service;

import com.kku.testapi.dto.PostResponseDTO;
import com.kku.testapi.entity.Like;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.LikeRepository;
import com.kku.testapi.repository.CommentRepository;
import com.kku.testapi.repository.ShareRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @Autowired
    private CommentRepository commentRepository; // เพิ่มการอ้างอิง CommentRepository

    @Autowired
    private ShareRepository shareRepository; // เพิ่มการอ้างอิง ShareRepository

    // Toggle like (if already liked, remove it; otherwise, add it)
    @Transactional
    public PostResponseDTO toggleLike(Integer userId, Integer postId) {
        // ดึง User และ Post
        User user = userService.getUserById(userId);
        Post post = postService.getPostEntityById(postId);

        if (user == null || post == null) {
            throw new IllegalArgumentException("User or Post not found");
        }

        // ค้นหาว่าผู้ใช้เคย "Like" โพสต์นี้หรือยัง
        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);

        if (existingLike.isPresent()) {
            // ถ้าผู้ใช้เคย "Like" โพสต์แล้ว ให้ลบการ "Like" ออก
            likeRepository.delete(existingLike.get());
        } else {
            // ถ้าผู้ใช้ยังไม่เคย "Like" โพสต์ ให้เพิ่มการ "Like"
            Like newLike = new Like();
            newLike.setUser(user);
            newLike.setPost(post);
            likeRepository.save(newLike);

            // ส่งการแจ้งเตือนแบบ "Like"
            if (!post.getUser().getId().equals(user.getId())) {
                notificationService.sendLikeNotification(user, post.getUser(), post.getId());
            }
        }

        // ดึงจำนวน Like, Comment, และ Share จากฐานข้อมูล
        Integer likeAmount = likeRepository.countByPostId(postId);
        Integer commentAmount = commentRepository.countByPostId(postId);
        Integer shareAmount = shareRepository.countByPostId(postId);

        // ✅ ใช้ `User` แทน `userId` ใน `PostResponseDTO`
        return new PostResponseDTO(
                post.getId(),
                post.getContent(),
                post.getUser(), // ✅ ใช้ `User` แทน `userId`
                post.getTimestamp(),
                likeAmount,
                commentAmount,
                shareAmount);
    }
}
