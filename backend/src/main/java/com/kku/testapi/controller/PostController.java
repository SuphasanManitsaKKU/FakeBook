package com.kku.testapi.controller;

import com.kku.testapi.dto.PostDTO;
import com.kku.testapi.dto.PostResponseDTO;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.User;
import com.kku.testapi.service.PostService;
import com.kku.testapi.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService; // ใช้สำหรับดึง User

    @GetMapping("/{id}")
    public PostResponseDTO getPostById(@PathVariable Integer id) {
        return postService.getPostById(id);
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostDTO postDTO) {
        if (postDTO.getUserId() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        System.out.println("postDTO.getUserId() = " + postDTO.getUserId());
        // 🔹 ดึง User จาก userId
        User user = userService.getUserById(postDTO.getUserId());
        if (user == null) {
            return ResponseEntity.badRequest().body(null);
        }
        System.out.println("user = " + user);
        // 🔹 สร้าง Post แล้วเซ็ต User
        Post post = new Post();
        post.setContent(postDTO.getContent());
        post.setUser(user);
        System.out.println("post = " + post);
        // 🔹 บันทึก Post ลงฐานข้อมูล
        Post savedPost = postService.createPost(post);
        return ResponseEntity.ok(savedPost);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDTO> updatePost(@PathVariable Integer id, @RequestBody PostDTO postDTO) {
        if (postDTO.getUserId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // 🔹 ดึงโพสต์ที่ต้องการอัปเดต
        Post existingPost = postService.getPostEntityById(id);
        if (existingPost == null) {
            return ResponseEntity.notFound().build();
        }

        // 🔹 ดึง User เพื่อเช็คว่าเป็นเจ้าของโพสต์จริงหรือไม่
        User user = userService.getUserById(postDTO.getUserId());
        if (user == null || !existingPost.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // ❌ Forbidden: ผู้ใช้ไม่ใช่เจ้าของโพสต์
        }

        // 🔹 อัปเดตเนื้อหาโพสต์
        existingPost.setContent(postDTO.getContent());
        Post updatedPost = postService.updatePost(id, existingPost);

        // 🔹 แปลงเป็น `PostResponseDTO` แล้วส่งกลับ
        PostResponseDTO responseDTO = postService.convertToPostResponseDTO(updatedPost);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
    }

    @GetMapping("/user-and-friends/{userId}")
    public List<PostResponseDTO> getUserAndFriendsPosts(@PathVariable Integer userId) {
        List<PostResponseDTO> posts = postService.getUserAndFriendsPosts(userId);
        System.out.println("----------------------------------------------------------------------------9");
        return posts;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponseDTO>> getPostsByUser(@PathVariable Integer userId) {
        List<PostResponseDTO> userPosts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(userPosts);
    }
}
