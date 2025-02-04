package com.kku.testapi.service;

import com.kku.testapi.dto.PostResponseDTO;
import com.kku.testapi.entity.Comment;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.Share;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.CommentRepository;
import com.kku.testapi.repository.LikeRepository;
import com.kku.testapi.repository.PostRepository;
import com.kku.testapi.repository.ShareRepository;
import com.kku.testapi.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private LikeRepository likeRepository;

    public Post getPostEntityById(Integer id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));
    }

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get post by ID
    public PostResponseDTO getPostById(Integer id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));

        int likeAmount = likeRepository.countByPostId(id);
        int commentAmount = commentRepository.countByPostId(id);
        int shareAmount = shareRepository.countByPostId(id);

        return new PostResponseDTO(
                post.getId(),
                post.getContent(),
                post.getUser(), // ✅ ใช้ `User` แทน `userId`
                post.getTimestamp(),
                likeAmount,
                commentAmount,
                shareAmount);
    }

    // Create a new post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // Update an existing post
    public Post updatePost(Integer id, Post updatedPost) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));
        return postRepository.save(existingPost);
    }

    public PostResponseDTO convertToPostResponseDTO(Post post) {
        return new PostResponseDTO(
                post.getId(),
                post.getContent(),
                post.getUser(), // ✅ ใช้ `User` ตรงๆ
                post.getTimestamp(),
                likeRepository.countByPostId(post.getId()),
                commentRepository.countByPostId(post.getId()),
                shareRepository.countByPostId(post.getId()));
    }

    // Delete a post
    @Transactional
    public void deletePost(Integer postId) {
        System.out.println("------------------------------1");
        // 🔹 ตรวจสอบว่าโพสต์มีอยู่จริงหรือไม่
        Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        
        System.out.println("------------------------------2");
        // 🔹 ลบไลก์ที่เกี่ยวข้องก่อน
        likeRepository.deleteByPostId(postId);
        
        System.out.println("------------------------------3");
        // 🔹 ลบคอมเมนต์ทั้งหมดที่เกี่ยวข้อง
        commentRepository.deleteByPostId(postId);
        
        System.out.println("------------------------------4");
        // 🔹 ลบแชร์ที่เกี่ยวข้อง (ถ้ามีระบบแชร์)
        shareRepository.deleteByPostId(postId);
        
        System.out.println("------------------------------5");
        // 🔹 ลบโพสต์
        postRepository.delete(post);
        System.out.println("------------------------------6");
    }

    @Transactional
    public List<PostResponseDTO> getUserAndFriendsPosts(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<User> friends = userRepository.findFriendsByUserId(userId);
        friends.add(user); // รวมโพสต์ของตัวเองด้วย

        List<Post> posts = postRepository.findByUserIn(friends);

        return posts.stream().map(post -> new PostResponseDTO(
                post.getId(),
                post.getContent(),
                post.getUser(),
                post.getTimestamp(),
                likeRepository.countByPostId(post.getId()),
                commentRepository.countByPostId(post.getId()),
                shareRepository.countByPostId(post.getId()))).collect(Collectors.toList());
    }
}
