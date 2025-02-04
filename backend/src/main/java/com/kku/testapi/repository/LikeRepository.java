package com.kku.testapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Like;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.User;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    // Find all likes for a specific post
    int countByPostId(Integer postId);

    // Check if a user has already liked a post
    boolean existsByUserAndPost(User user, Post post);
    Optional<Like> findByUserAndPost(User user, Post post);

    @Modifying
    @Query("DELETE FROM Like l WHERE l.post.id = :postId")
    void deleteByPostId(@Param("postId") Integer postId);
}