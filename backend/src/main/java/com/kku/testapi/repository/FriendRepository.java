package com.kku.testapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Friend;
import com.kku.testapi.entity.User;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Integer> {

    List<Friend> findByUserOneIdOrUserTwoId(Integer userOneId, Integer userTwoId);
    List<Friend> findByUserOneOrUserTwo(User userOne, User userTwo); 
    
}