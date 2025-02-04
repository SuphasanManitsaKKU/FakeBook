package com.kku.testapi.controller;

import com.kku.testapi.dto.CommentRequestDTO;
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

    // ดึงความคิดเห็นทั้งหมดของโพสต์
    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable Integer postId) {
        return commentService.getCommentsByPost(postId);
    }

    // ✅ สร้างความคิดเห็นใหม่
    @PostMapping
    public Comment createComment(@RequestBody CommentRequestDTO commentRequest) {
        return commentService.createComment(commentRequest);
    }

    // ✅ ดึงความคิดเห็นซ้อน (nested comments)
    @GetMapping("/nested/{parentCommentId}")
    public List<Comment> getNestedComments(@PathVariable Integer parentCommentId) {
        return commentService.getNestedComments(parentCommentId);
    }

    // ✅ อัปเดตความคิดเห็น
    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable Integer id, @RequestBody Comment updatedComment) {
        return commentService.updateComment(id, updatedComment);
    }

    // ✅ ลบความคิดเห็น
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Integer id) {
        commentService.deleteComment(id);
    }

    // ✅ ลบความคิดเห็นทั้งหมดของโพสต์
    @DeleteMapping("/post/{postId}")
    public void deleteCommentsByPost(@PathVariable Integer postId) {
        commentService.deleteCommentsByPost(postId);
    }
}
