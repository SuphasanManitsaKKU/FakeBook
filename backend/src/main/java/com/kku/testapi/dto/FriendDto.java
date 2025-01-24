package com.kku.testapi.dto;

import com.kku.testapi.entity.User;

public class FriendDto {
    private Integer id;
    private User user;

    public FriendDto(Integer id, User user) {
        this.id = id;
        this.user = user;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
