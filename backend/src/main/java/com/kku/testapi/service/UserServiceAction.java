package com.kku.testapi.service;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.kku.testapi.entity.User;
import com.kku.testapi.repository.UserRepository;

@Service
public class UserServiceAction implements UserService {

    private final UserRepository userRepository;

    public UserServiceAction(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        throw new RuntimeException("Invalid username or password");
    }

    @Override
    public String register(User user) {
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

    @Override
    public List<User> searchByUsername(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username);
    }

    // Implement getUserById
    @Override
    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ อัปเดตข้อมูลผู้ใช้
    public User updateUserProfile(User updatedUser) {
        User user = userRepository.findById(updatedUser.getId()).orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(updatedUser.getUsername());
        user.setBio(updatedUser.getBio());
        user.setGender(updatedUser.getGender());
        user.setLocation(updatedUser.getLocation());
        user.setBirthday(updatedUser.getBirthday());
        user.setCoverImage(updatedUser.getCoverImage());
        user.setImageProfile(updatedUser.getImageProfile());
        
        return userRepository.save(user);
    }

    // ✅ ลบผู้ใช้
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

}
