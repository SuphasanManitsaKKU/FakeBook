package com.kku.testapi.service;

import java.util.List;

import com.kku.testapi.entity.User;

public interface FriendService {
    List<User> findFriendsByUserId(Integer userId);
    void addFriend(User userOne, User userTwo);
}