package com.kku.testapi.repository;

import com.kku.testapi.entity.ChatRoom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    @Query("SELECT c FROM ChatRoom c WHERE " +
           "(c.userOne.id = :userOneId AND c.userTwo.id = :userTwoId) OR " +
           "(c.userOne.id = :userTwoId AND c.userTwo.id = :userOneId)")
    Optional<ChatRoom> findByUserIds(@Param("userOneId") Integer userOneId, @Param("userTwoId") Integer userTwoId);
}
