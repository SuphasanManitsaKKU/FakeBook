package com.kku.testapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
}