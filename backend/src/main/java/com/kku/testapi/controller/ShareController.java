package com.kku.testapi.controller;

import com.kku.testapi.dto.PostResponseDTO;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.Share;
import com.kku.testapi.entity.User;
import com.kku.testapi.service.ShareService;
import com.kku.testapi.service.UserService;
import com.kku.testapi.service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/shares")
public class ShareController {

    @Autowired
    private ShareService shareService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    // ดึงโพสต์ที่ผู้ใช้แชร์
    @GetMapping("/user/{userId}")
    public List<PostResponseDTO> getSharedPostsByUser(@PathVariable Integer userId) {
        User user = userService.getUserById(userId);

        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }

        return shareService.getSharedPostsByUser(user);
    }

    // แชร์โพสต์
    @PostMapping
    public Map<String, Object> sharePost(@RequestParam Integer userId, @RequestParam Integer postId) {
        User user = userService.getUserById(userId);
        Post post = postService.getPostEntityById(postId);

        if (user == null || post == null) {
            throw new IllegalArgumentException("User or Post not found");
        }

        Share share = shareService.sharePost(user, post); // รับ `Share` ที่ถูกบันทึก
        PostResponseDTO postResponse = postService.getPostById(postId);

        // สร้าง Map และเพิ่ม `shareId` เข้าไป
        Map<String, Object> response = new HashMap<>();
        response.put("shareId", share.getId());
        response.put("post", postResponse); // คืนค่า PostResponseDTO โดยไม่ต้องแก้ไขมัน

        return response;
    }

    // ลบ Share ตาม ID
    @DeleteMapping("/{shareId}")
    public void deleteShare(@PathVariable Integer shareId) {
        shareService.deleteShare(shareId);
    }
}
