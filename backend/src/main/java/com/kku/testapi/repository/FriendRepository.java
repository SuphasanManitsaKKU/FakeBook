package com.kku.testapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Friend;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Integer> {
}