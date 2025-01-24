package com.kku.testapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kku.testapi.dto.FriendDto;
import com.kku.testapi.entity.Friend;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.FriendRepository;
import java.util.stream.Collectors;

@Service
public class FriendServiceAction implements FriendService {
    
    private final FriendRepository friendRepository;

    public FriendServiceAction(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

    @Override
    public List<FriendDto> findFriendsByUserId(Integer id) {
        List<Friend> friends = friendRepository.findByUserOneIdOrUserTwoId(id, id);

        // กรองข้อมูลให้แสดงเฉพาะเพื่อนที่ไม่ใช่ตัวเอง
        return friends.stream()
                .map(friend -> {
                    User friendUser = friend.getUserOne().getId().equals(id) ? friend.getUserTwo() : friend.getUserOne();
                    return new FriendDto(friend.getId(), friendUser);
                })
                .collect(Collectors.toList());
    }
}