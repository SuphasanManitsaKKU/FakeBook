package com.kku.testapi.controller;

import com.kku.testapi.entity.Comment;
import com.kku.testapi.service.CommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Get all comments for a specific post
    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable Integer postId) {
        return commentService.getCommentsByPost(postId);
    }

    // Create a new comment
    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        return commentService.createComment(comment);
    }

    // Update an existing comment
    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable Integer id, @RequestBody Comment updatedComment) {
        return commentService.updateComment(id, updatedComment);
    }

    // Delete a comment by ID
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Integer id) {
        commentService.deleteComment(id);
    }

    // ลบความคิดเห็นทั้งหมดของโพสต์
    @DeleteMapping("/post/{postId}")
    public void deleteCommentsByPost(@PathVariable Integer postId) {
        commentService.deleteCommentsByPost(postId);
    }
}
