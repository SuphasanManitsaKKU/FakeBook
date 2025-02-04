package com.kku.testapi.dto;

import com.kku.testapi.entity.User;

public class FriendDto {
    private Integer id;
    private String username;
    private String email;

    // ✅ Constructor ที่รับ `User` เป็นพารามิเตอร์
    public FriendDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername(); // สมมติว่า `User` มีฟิลด์ `username`
        this.email = user.getEmail(); // สมมติว่า `User` มีฟิลด์ `email`
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
