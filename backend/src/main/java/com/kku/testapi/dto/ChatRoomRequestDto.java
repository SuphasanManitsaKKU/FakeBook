package com.kku.testapi.dto;

public class ChatRoomRequestDto {
    private Integer userOneId;
    private Integer userTwoId;
    private Integer chatRoomId;

    public Integer getUserOneId() {
        return userOneId;
    }
    public void setUserOneId(Integer userOneId) {
        this.userOneId = userOneId;
    }
    public Integer getUserTwoId() {
        return userTwoId;
    }
    public void setUserTwoId(Integer userTwoId) {
        this.userTwoId = userTwoId;
    }
    public Integer getChatRoomId() {
        return chatRoomId;
    }
    public void setChatRoomId(Integer chatRoomId) {
        this.chatRoomId = chatRoomId;
    }
}
