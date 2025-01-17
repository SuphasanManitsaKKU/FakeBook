package com.kku.testapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
}