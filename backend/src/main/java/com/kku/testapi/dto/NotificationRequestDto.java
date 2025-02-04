package com.kku.testapi.dto;

public class NotificationRequestDto {
    private String userId;
    private String message;
    private String type;  // เพิ่มฟิลด์ type

    // Getters และ Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
