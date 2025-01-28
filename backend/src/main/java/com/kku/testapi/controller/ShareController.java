package com.kku.testapi.controller;

import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.Share;
import com.kku.testapi.entity.User;
import com.kku.testapi.service.ShareService;
import com.kku.testapi.service.UserService;
import com.kku.testapi.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shares")
public class ShareController {

    @Autowired
    private ShareService shareService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    // ดึงโพสต์ที่ผู้ใช้แชร์
    @GetMapping("/user/{userId}")
    public List<Share> getSharedPostsByUser(@PathVariable Integer userId) {
        User user = userService.getUserById(userId);
        return shareService.getSharedPostsByUser(user);
    }

    // แชร์โพสต์
    @PostMapping
    public Share sharePost(@RequestParam Integer userId, @RequestParam Integer postId) {
        User user = userService.getUserById(userId);
        Post post = postService.getPostById(postId);
        return shareService.sharePost(user, post);
    }

    // ลบ Share ตาม ID
    @DeleteMapping("/{shareId}")
    public void deleteShare(@PathVariable Integer shareId) {
        shareService.deleteShare(shareId);
    }
}
