package com.kku.testapi.service;

import com.kku.testapi.dto.PostResponseDTO;
import com.kku.testapi.entity.Like;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.LikeRepository;
import com.kku.testapi.repository.CommentRepository;
import com.kku.testapi.repository.ShareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ✅ ใส่ `;` ให้เรียบร้อย

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
    private CommentRepository commentRepository;

    @Autowired
    private ShareRepository shareRepository;

    @Transactional
    public PostResponseDTO toggleLike(Integer userId, Integer postId) {
        // ดึง User และ Post
        User user = userService.getUserById(userId);
        Post post = postService.getPostEntityById(postId);
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++1");
        
        if (user == null || post == null) {
            throw new IllegalArgumentException("User or Post not found");
        }
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++2");
        
        // ค้นหาว่าผู้ใช้เคย "Like" โพสต์นี้หรือยัง
        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++3");
        
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get()); // ลบ Like
        } else {
            Like newLike = new Like();
            newLike.setUser(user);
            newLike.setPost(post);
            likeRepository.save(newLike);
            
            if (!post.getUser().getId().equals(user.getId())) {
                notificationService.sendLikeNotification(user, post.getUser(), postId);
            }
        }
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++4");
        
        // ดึงจำนวน Like, Comment, และ Share
        Integer likeAmount = likeRepository.countByPostId(postId);
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++9999");
        Integer commentAmount = commentRepository.countByPostId(postId);
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++77777");
        Integer shareAmount = shareRepository.countByPostId(postId);
        
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++5");
        // ✅ แปลง User ให้มี Base64 Image
        User userWithBase64 = userService.getUserWithBase64Images(post.getUser().getId());
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++lskdfjlsdkfj");
        return new PostResponseDTO(
                post.getId(),
                post.getContent(),
                userWithBase64,
                post.getTimestamp(),
                likeAmount,
                commentAmount,
                shareAmount);
    }




}
