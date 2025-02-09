package com.kku.testapi.service;

import java.util.List;

import com.kku.testapi.dto.CommentRequestDTO;
import com.kku.testapi.entity.Comment;

public interface CommentService {
    public Comment createComment(CommentRequestDTO commentRequest);
    public List<Comment> getCommentsByPost(Integer postId);
    public List<Comment> getNestedComments(Integer parentCommentId);
    public Comment updateComment(Integer id, Comment updatedComment);
    public void deleteComment(Integer id);
    public void deleteCommentsByPost(Integer postId);
}
