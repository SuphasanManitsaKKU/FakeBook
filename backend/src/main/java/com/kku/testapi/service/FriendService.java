package com.kku.testapi.service;

import java.util.List;

import com.kku.testapi.dto.FriendDto;

public interface FriendService {
    List<FriendDto> findFriendsByUserId(Integer id);
    
}