package com.kku.testapi.service;

import com.kku.testapi.entity.Comment;
import com.kku.testapi.entity.Post;
import com.kku.testapi.repository.CommentRepository;
import com.kku.testapi.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    // Get all comments for a specific post
    public List<Comment> getCommentsByPost(Integer postId) {
        return commentRepository.findByPostId(postId);
    }

    // Create a new comment
    public Comment createComment(Comment comment) {
        Post post = postRepository.findById(comment.getPost().getId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Post not found with ID: " + comment.getPost().getId()));

        comment.setPost(post);
        return commentRepository.save(comment);
    }

    // Update an existing comment
    public Comment updateComment(Integer commentId, Comment updatedComment) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));

        existingComment.setMessage(updatedComment.getMessage());
        return commentRepository.save(existingComment);
    }

    // Delete a comment by ID and its child comments
    public void deleteComment(Integer id) {
        if (!commentRepository.existsById(id)) {
            throw new IllegalArgumentException("Comment not found with ID: " + id);
        }

        // ลบ comment ลูกทั้งหมด
        deleteChildComments(id);

        // ลบ comment ปัจจุบัน
        commentRepository.deleteById(id);
    }

    // Recursive method to delete child comments
    private void deleteChildComments(Integer parentCommentId) {
        List<Comment> childComments = commentRepository.findByParentCommentId(parentCommentId);
        for (Comment childComment : childComments) {
            deleteChildComments(childComment.getId()); // ลบ comment ลูกของลูก
            commentRepository.deleteById(childComment.getId());
        }
    }

    // ลบความคิดเห็นทั้งหมดสำหรับโพสต์
    public void deleteCommentsByPost(Integer postId) {
        if (!postRepository.existsById(postId)) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }
        commentRepository.deleteByPostId(postId);
    }
}
