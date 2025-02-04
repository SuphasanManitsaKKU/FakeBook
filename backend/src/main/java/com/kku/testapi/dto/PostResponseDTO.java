package com.kku.testapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kku.testapi.entity.User;
import java.time.LocalDateTime;

public class PostResponseDTO {
    private Integer id;
    private String content;

    @JsonIgnoreProperties({ "password", "email" }) // ✅ ซ่อนข้อมูลที่ไม่จำเป็น
    private User user;

    private LocalDateTime timestamp;
    private Integer likeAmount;
    private Integer commentAmount;
    private Integer shareAmount;

    public PostResponseDTO(Integer id, String content, User user, LocalDateTime timestamp,
            Integer likeAmount, Integer commentAmount, Integer shareAmount) {
        this.id = id;
        this.content = content;
        this.user = user;
        this.timestamp = timestamp;
        this.likeAmount = likeAmount;
        this.commentAmount = commentAmount;
        this.shareAmount = shareAmount;
    }

    // ✅ Getter และ Setter
    public Integer getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public User getUser() {
        return user;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Integer getLikeAmount() {
        return likeAmount;
    }

    public Integer getCommentAmount() {
        return commentAmount;
    }

    public Integer getShareAmount() {
        return shareAmount;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setLikeAmount(Integer likeAmount) {
        this.likeAmount = likeAmount;
    }

    public void setCommentAmount(Integer commentAmount) {
        this.commentAmount = commentAmount;
    }

    public void setShareAmount(Integer shareAmount) {
        this.shareAmount = shareAmount;
    }

    @Override
    public String toString() {
        return "PostResponseDTO{" +
                "id=" + id +
                ", content='" + content + '\'' +
                ", user=" + (user != null ? user.getUsername() : "null") +
                ", timestamp=" + timestamp +
                ", likeAmount=" + likeAmount +
                ", commentAmount=" + commentAmount +
                ", shareAmount=" + shareAmount +
                '}';
    }
}
