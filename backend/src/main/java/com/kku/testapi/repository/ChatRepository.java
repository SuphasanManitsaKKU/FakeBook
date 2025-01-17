package com.kku.testapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {
}