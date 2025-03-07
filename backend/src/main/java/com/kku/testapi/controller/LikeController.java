package com.kku.testapi.controller;

import com.kku.testapi.dto.PostResponseDTO;
import com.kku.testapi.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    // Toggle like (if already liked, remove it; otherwise, add it)
    @PostMapping("/toggle")
    public PostResponseDTO toggleLike(@RequestParam Integer userId, @RequestParam Integer postId) {
        PostResponseDTO response = likeService.toggleLike(userId, postId);
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++676767");
        return response;
    }
}
