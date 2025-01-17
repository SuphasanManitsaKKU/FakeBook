package com.kku.testapi.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.kku.testapi.Util.JwtUtil;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.UserRepository;

@Service
public class UserServiceAction implements UserService {

    private final UserRepository userRepository;

    public UserServiceAction(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public String login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(password, user.getPassword())) {
                // สร้าง JWT Token
                return JwtUtil.generateToken(username);
            }
        }
        throw new RuntimeException("Invalid username or password");
    }

    @Override
    public String register(User user) {
        System.out.println("--------------------------------------------------");
        // ตรวจสอบว่าชื่อผู้ใช้ซ้ำหรือไม่
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }

        // ตรวจสอบว่าอีเมลซ้ำหรือไม่
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        // เข้ารหัสรหัสผ่าน
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // บันทึกผู้ใช้ลงฐานข้อมูล
        userRepository.save(user);

        return "Register success";
    }
}
