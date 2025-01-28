package com.kku.testapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Like;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.User;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    // Find all likes for a specific post
    List<Like> findByPostId(Integer postId);

    // Check if a user has already liked a post
    boolean existsByUserAndPost(User user, Post post);
}