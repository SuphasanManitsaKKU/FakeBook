package com.kku.testapi.controller;

import com.kku.testapi.entity.Like;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.User;
import com.kku.testapi.service.LikeService;
import com.kku.testapi.service.PostService;
import com.kku.testapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    // Get all likes for a specific post
    @GetMapping("/post/{postId}")
    public List<Like> getLikesByPost(@PathVariable Integer postId) {
        return likeService.getLikesByPost(postId);
    }

    // Add a like to a post
    @PostMapping
    public Like likePost(@RequestParam Integer userId, @RequestParam Integer postId) {
        User user = userService.getUserById(userId);
        Post post = postService.getPostById(postId);
        return likeService.addLike(user, post);
    }

    // Remove a like from a post
    @DeleteMapping("/{id}")
    public void unlikePost(@PathVariable Integer id) {
        likeService.deleteLike(id);
    }
}
