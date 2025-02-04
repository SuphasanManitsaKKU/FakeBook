package com.kku.testapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.Friend;
import com.kku.testapi.entity.User;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Integer> {

    List<Friend> findByUserOneIdOrUserTwoId(Integer userOneId, Integer userTwoId);

    List<Friend> findByUserOneOrUserTwo(User userOne, User userTwo);

    boolean existsByUserOneAndUserTwo(User userOne, User userTwo);

    @Query("SELECT f FROM Friend f " +
       "WHERE (f.userOne = :user AND f.userTwo = :friend) " +
       "   OR (f.userOne = :friend AND f.userTwo = :user)")
Optional<Friend> findFriendship(
    @Param("user") User user,
    @Param("friend") User friend
);



}