package com.kku.testapi.service;

import com.kku.testapi.dto.PostResponseDTO;
import com.kku.testapi.entity.Post;
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

    @Autowired
    private UserService userService; // ✅ Inject UserService

    public Post getPostEntityById(Integer id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));
    }

    // ✅ ดึงโพสต์ทั้งหมด
    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToPostResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ ดึงโพสต์ตาม ID
    public PostResponseDTO getPostById(Integer id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));

        return convertToPostResponseDTO(post);
    }

    // ✅ สร้างโพสต์ใหม่
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // ✅ อัปเดตโพสต์
    public Post updatePost(Integer id, Post updatedPost) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));

        existingPost.setContent(updatedPost.getContent());
        return postRepository.save(existingPost);
    }

    // ✅ ลบโพสต์
    @Transactional
    public void deletePost(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        likeRepository.deleteByPostId(postId);
        commentRepository.deleteByPostId(postId);
        shareRepository.deleteByPostId(postId);
        postRepository.delete(post);
    }

    // ✅ ดึงโพสต์ของตัวเองและเพื่อน
    public List<PostResponseDTO> getUserAndFriendsPosts(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        System.out.println("----------------------------------------------------------------------------1");
        List<User> friends = userRepository.findFriendsByUserId(userId);
        System.out.println("----------------------------------------------------------------------------2");
        friends.add(user);
        System.out.println("----------------------------------------------------------------------------3");

        List<Post> posts = postRepository.findByUserIn(friends);
        System.out.println("----------------------------------------------------------------------------4");
        
        List<PostResponseDTO> resPosts = posts.stream().map(this::convertToPostResponseDTO).collect(Collectors.toList());
        System.out.println("----------------------------------------------------------------------------8");
        return resPosts;
    }

    // ✅ แปลง `Post` เป็น `PostResponseDTO` และแปลง User ให้มี Base64 Image
    public PostResponseDTO convertToPostResponseDTO(Post post) {
        System.out.println("----------------------------------------------------------------------------5");
        User userWithBase64 = userService.getUserWithBase64Images(post.getUser().getId());
        System.out.println("----------------------------------------------------------------------------6");
        // System.out.println(post.getUser().getImageProfile());
        PostResponseDTO postResponseDTO = new PostResponseDTO(
                post.getId(),
                post.getContent(),
                userWithBase64, // ✅ ส่ง User ที่แปลงเป็น Base64 แล้ว
                post.getTimestamp(),
                likeRepository.countByPostId(post.getId()),
                commentRepository.countByPostId(post.getId()),
                shareRepository.countByPostId(post.getId()));
        System.out.println("----------------------------------------------------------------------------7");
        return postResponseDTO;
    }
}
