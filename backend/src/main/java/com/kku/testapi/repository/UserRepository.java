package com.kku.testapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kku.testapi.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    // ค้นหา User ตาม username
    User findByUsername(String username);

    // ค้นหา User ตาม email
    User findByEmail(String email);

    // ค้นหา User ตาม username และ password (สำหรับ login)
    User findByUsernameAndPassword(String username, String password);

    // ค้นหา User ตาม username โดยไม่สนใจตัวเล็กตัวใหญ่
    List<User> findByUsernameContainingIgnoreCase(String username);
}
