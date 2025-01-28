package com.kku.testapi.service;

import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.Share;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.ShareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShareService {

    @Autowired
    private ShareRepository shareRepository;

    // ดึงโพสต์ทั้งหมดที่ถูกแชร์โดยผู้ใช้งาน
    public List<Share> getSharedPostsByUser(User user) {
        return shareRepository.findByUser(user);
    }

    // เพิ่มการแชร์โพสต์
    public Share sharePost(User user, Post post) {
        Share share = new Share();
        share.setUser(user);
        share.setPost(post);
        return shareRepository.save(share);
    }

    // ลบ Share ตาม ID
    public void deleteShare(Integer shareId) {
        if (!shareRepository.existsById(shareId)) {
            throw new IllegalArgumentException("Share not found with ID: " + shareId);
        }
        shareRepository.deleteById(shareId);
    }
}
