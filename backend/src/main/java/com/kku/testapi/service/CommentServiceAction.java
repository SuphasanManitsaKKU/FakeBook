package com.kku.testapi.service;

import com.kku.testapi.dto.CommentRequestDTO;
import com.kku.testapi.entity.Comment;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.CommentRepository;
import com.kku.testapi.repository.PostRepository;
import com.kku.testapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class CommentServiceAction {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    // สร้างความคิดเห็นใหม่
    @Transactional
    public Comment createComment(CommentRequestDTO commentRequest) {
        Post post = postRepository.findById(commentRequest.getPostId())
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(commentRequest.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = new Comment();
        comment.setMessage(commentRequest.getMessage());
        comment.setPost(post);
        comment.setUser(user);

        // ตรวจสอบว่ามี parent comment หรือไม่
        if (commentRequest.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(commentRequest.getParentCommentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));
            comment.setParentComment(parentComment); // กำหนด parent comment
        }

        // ส่งการแจ้งเตือนแบบ "Like"
        if (!post.getUser().getId().equals(user.getId())) {
            notificationService.sendCommentNotification(user, post.getUser(), commentRequest.getPostId());
        }

        return commentRepository.save(comment);
    }

    // ดึงความคิดเห็นทั้งหมดของโพสต์
    public List<Comment> getCommentsByPost(Integer postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);

        // ✅ แปลงรูปภาพของ User เป็น Base64 ก่อนส่งออกไป
        comments.forEach(comment -> {
            User user = comment.getUser();
            user.setImageProfile(userService.getUserWithBase64Images(user.getId()).getImageProfile());
        });

        return comments;
    }

    // ดึงความคิดเห็นซ้อน
    public List<Comment> getNestedComments(Integer parentCommentId) {
        List<Comment> nestedComments = commentRepository.findByParentCommentId(parentCommentId);

        // ✅ แปลงรูปภาพของ User เป็น Base64 ก่อนส่งออกไป
        nestedComments.forEach(comment -> {
            User user = comment.getUser();
            user.setImageProfile(userService.getUserWithBase64Images(user.getId()).getImageProfile());
        });

        return nestedComments;
    }

    // อัปเดตความคิดเห็น
    @Transactional
    public Comment updateComment(Integer id, Comment updatedComment) {
        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        existingComment.setMessage(updatedComment.getMessage());

        // ✅ บันทึกการอัปเดต
        Comment savedComment = commentRepository.save(existingComment);

        // ✅ แปลงรูปภาพของ User เป็น Base64 ก่อนส่งออกไป
        User user = savedComment.getUser();
        user.setImageProfile(userService.getUserWithBase64Images(user.getId()).getImageProfile());

        return savedComment;
    }

    // ลบความคิดเห็น
    @Transactional
    public void deleteComment(Integer id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        // ✅ 1. ค้นหาคอมเมนต์ลูกทั้งหมด
        List<Comment> childComments = commentRepository.findByParentComment(comment);

        // ✅ 2. ลบคอมเมนต์ลูกทั้งหมดก่อน
        for (Comment child : childComments) {
            deleteComment(child.getId());
        }

        // ✅ 3. ลบคอมเมนต์หลัก
        commentRepository.delete(comment);
    }

    // ลบความคิดเห็นทั้งหมดของโพสต์
    @Transactional
    public void deleteCommentsByPost(Integer postId) {
        // ใช้ deleteByPostId() แทน deleteAll()
        commentRepository.deleteByPostId(postId);
    }

}
