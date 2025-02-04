package com.kku.testapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Share;
import com.kku.testapi.entity.User;

@Repository
public interface ShareRepository extends JpaRepository<Share, Integer> {
    List<Share> findByUser(User user);
    List<Share> findByPostId(Integer postId);
    int countByPostId(Integer postId);

    @Modifying
    @Query("DELETE FROM Share s WHERE s.post.id = :postId")
    void deleteByPostId(@Param("postId") Integer postId);
}