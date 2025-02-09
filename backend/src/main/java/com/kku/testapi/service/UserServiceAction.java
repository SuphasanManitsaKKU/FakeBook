package com.kku.testapi.service;

import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.kku.testapi.entity.User;
import com.kku.testapi.repository.UserRepository;
import java.nio.file.Path;
import java.util.Base64;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;


@Service
public class UserServiceAction implements UserService {
    @PersistenceContext
    private EntityManager entityManager;

    private static final String UPLOAD_DIR = "public/assets/";

    @Autowired
    private UserRepository userRepository;

    public byte[] loadImage(String filename) {
        try {
            Path imagePath = Paths.get(UPLOAD_DIR + filename);
            return Files.readAllBytes(imagePath);
        } catch (Exception e) {
            System.err.println("Error loading image: " + e.getMessage());
            return null;
        }
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
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(username);

        // ✅ แปลงรูปภาพทุก User ในรายการเป็น Base64
        return users.stream()
                .map(user -> getUserWithBase64Images(user.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public User getUserById(Integer id) {
        // ✅ ดึงข้อมูล User จาก Database
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        // ✅ แปลงรูปภาพเป็น Base64 ก่อนส่งออก
        return getUserWithBase64Images(user.getId());
    }

    @Override
    public List<User> getAllUsers() {
        // ✅ ดึงข้อมูลผู้ใช้ทั้งหมดจาก Database
        List<User> users = userRepository.findAll();

        // ✅ แปลงรูปภาพของทุก User เป็น Base64
        return users.stream()
                .map(user -> getUserWithBase64Images(user.getId()))
                .collect(Collectors.toList());
    }

    // ✅ อัปเดตข้อมูลผู้ใช้
    public User updateUserProfile(User updatedUser) {
        User user = userRepository.findById(updatedUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

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

    public void updateProfileImage(Integer userId, String imagePath) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setImageProfile(imagePath); // อัปเดต path รูปโปรไฟล์
            userRepository.save(user); // บันทึกข้อมูลลง DB
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    public void updateCoverImage(Integer userId, String imagePath) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setCoverImage(imagePath); // อัปเดต path รูป Cover
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    public User getUserWithBase64Images(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        // System.out.println(user.getId());
        // System.out.println(user.getImageProfile());
        // System.out.println(user.getCoverImage());
        // ✅ แปลงรูปภาพเป็น Base64
        entityManager.detach(user);
        user.setImageProfile(convertImageToBase64(user.getImageProfile()));
        user.setCoverImage(convertImageToBase64(user.getCoverImage()));

        // System.out.println(user.getCoverImage());
        // System.out.println(user.getImageProfile());

        return user; // ✅ ส่ง User กลับไปพร้อมรูปภาพ Base64
    }

    private String convertImageToBase64(String filename) {
        try {
            if (filename == null || filename.isEmpty()) {
                return null;
            }
    
            // ✅ ถ้า filename เริ่มต้นด้วย "data:image/png;base64," แสดงว่าเป็น Base64 อยู่แล้ว → return เลย
            if (filename.startsWith("data:image/")) {
                return filename;
            }
            System.out.println("filename = " + filename + "-------------");
    
            // ✅ ลบ "/assets/" ออกจาก path ที่ส่งเข้าไป
            filename = filename.replace("/assets/", "");
    
            Path imagePath = Paths.get(UPLOAD_DIR + filename);
    
            if (!Files.exists(imagePath)) {
                System.err.println("File not found");
                // System.err.println("File not found: " + imagePath);
                return null;
            }
    
            byte[] imageBytes = Files.readAllBytes(imagePath);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
        } catch (Exception e) {
            System.err.println("Error loading image: " + e.getMessage());
            return null;
        }
    }    

}
