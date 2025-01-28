package com.kku.testapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Share;
import com.kku.testapi.entity.User;

@Repository
public interface ShareRepository extends JpaRepository<Share, Integer> {
    List<Share> findByUser(User user);
    List<Share> findByPostId(Integer postId);
}