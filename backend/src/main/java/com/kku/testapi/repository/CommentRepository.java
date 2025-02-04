package com.kku.testapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    int countByPostId(Integer postId);

    // ดึงความคิดเห็นทั้งหมดของโพสต์
    List<Comment> findByPostId(Integer postId);

    // ดึงความคิดเห็นซ้อนจาก parentCommentId
    List<Comment> findByParentCommentId(Integer parentCommentId);

    // ลบความคิดเห็นทั้งหมดของโพสต์
    void deleteByPostId(Integer postId); // เปลี่ยนเป็นลบตาม postId

    List<Comment> findByParentComment(Comment parentComment);

}