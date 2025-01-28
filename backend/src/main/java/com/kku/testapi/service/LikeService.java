package com.kku.testapi.service;

import com.kku.testapi.entity.Like;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    // Get all likes for a specific post
    public List<Like> getLikesByPost(Integer postId) {
        return likeRepository.findByPostId(postId);
    }

    // Add a like to a post
    public Like addLike(User user, Post post) {
        // Check if the user has already liked the post
        if (likeRepository.existsByUserAndPost(user, post)) {
            throw new IllegalArgumentException("User has already liked this post.");
        }
        Like like = new Like();
        like.setUser(user);
        like.setPost(post);
        return likeRepository.save(like);
    }

    // Remove a like by ID
    public void deleteLike(Integer id) {
        if (!likeRepository.existsById(id)) {
            throw new IllegalArgumentException("Like not found with ID: " + id);
        }
        likeRepository.deleteById(id);
    }
}
