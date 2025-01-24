package com.kku.testapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kku.testapi.dto.FriendDto;
import com.kku.testapi.service.FriendServiceAction;

@RestController
@RequestMapping("/api")
public class FriendController {
    private final FriendServiceAction friendService;

    @Autowired
    public FriendController(FriendServiceAction friendService) {
        this.friendService = friendService;
    }

    @GetMapping("/getAllFriends")
    public ResponseEntity<List<FriendDto>> getAllFriends(@RequestParam Integer id) {
        List<FriendDto> friends = friendService.findFriendsByUserId(id);
        return ResponseEntity.ok(friends);
    }
}
