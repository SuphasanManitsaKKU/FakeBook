package com.kku.testapi.dto;

public class NotificationRequestDto {
    private String userId;
    private String message;
    private String type;  // เพิ่มฟิลด์ type
    private Integer contentId;  // เพิ่มฟิลด์ contentId

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

    public Integer getContentId() {
        return contentId;
    }

    public void setContentId(Integer contentId) {
        this.contentId = contentId;
    }
}
