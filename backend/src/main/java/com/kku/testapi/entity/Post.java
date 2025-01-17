package com.kku.testapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer commentAmount;

    private String content;

    private Integer likeAmount;

    private Integer shareAmount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCommentAmount() {
        return commentAmount;
    }

    public void setCommentAmount(Integer commentAmount) {
        this.commentAmount = commentAmount;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLikeAmount() {
        return likeAmount;
    }

    public void setLikeAmount(Integer likeAmount) {
        this.likeAmount = likeAmount;
    }

    public Integer getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(Integer shareAmount) {
        this.shareAmount = shareAmount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}