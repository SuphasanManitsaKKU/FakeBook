package com.kku.testapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
}