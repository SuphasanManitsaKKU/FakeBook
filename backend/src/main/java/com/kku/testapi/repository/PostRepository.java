package com.kku.testapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.User;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByUserIn(List<User> users);
    List<Post> findByUserId(Integer userId);
}