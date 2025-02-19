package com.kku.testapi.controller;

import com.kku.testapi.Util.JwtUtil;
import com.kku.testapi.dto.NotificationRequestDto;
import com.kku.testapi.entity.User;
import com.kku.testapi.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.kku.testapi.repository.UserRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final String UPLOAD_DIR = "public/assets/";

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // ✅ ส่ง Notification ผ่าน WebSocket
    @PostMapping("/sendNotification")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequestDto request) {
        messagingTemplate.convertAndSend("/notification/messages/" + request.getUserId(), request.getMessage());
        return ResponseEntity.ok("Notification sent to user ID: " + request.getUserId());
    }

    @GetMapping("")
    public String home() {
        return "Hello World";
    }

    @GetMapping("/test")
    public String fff() {
        return "Hello World test";
    }

    // ✅ Login และสร้าง JWT
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        User userLogin = this.userService.login(user.getUsername(), user.getPassword());

        // สร้าง JWT Token
        String token = JwtUtil.generateToken(String.valueOf(userLogin.getId()), userLogin.getUsername());

        // สร้าง Cookie สำหรับ JWT
        ResponseCookie jwtCookie = ResponseCookie.from("token", token)
                .secure(false) // เปลี่ยนเป็น true ใน Production (HTTPS)
                .path("/")
                .maxAge(24 * 60 * 60) // อายุ 1 วัน
                .build();

        // สร้าง Response JSON
        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("userId", String.valueOf(userLogin.getId()));
        response.put("username", userLogin.getUsername());

        return ResponseEntity.ok()
                .header("Set-Cookie", jwtCookie.toString())
                .body(response);
    }

    // ✅ Logout และลบ JWT Cookie
    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        ResponseCookie jwtCookie = ResponseCookie.from("token", "")
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");

        return ResponseEntity.ok()
                .header("Set-Cookie", jwtCookie.toString())
                .body(response);
    }

    // ✅ Register ผู้ใช้ใหม่
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        this.userService.register(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ✅ ค้นหา User ตามชื่อ
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String username) {
        List<User> users = userService.searchByUsername(username);
        return ResponseEntity.ok(users);
    }

    // ✅ ดึง Users ทั้งหมด
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ✅ ดึงข้อมูล User ตาม ID
    @GetMapping("/{id}")
    public User getUser(@PathVariable Integer id) {
        return userService.getUserWithBase64Images(id);
    }

    // ✅ อัปเดตข้อมูลผู้ใช้
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserProfile(@RequestBody User user) {
        // ตรวจสอบว่ามี User อยู่จริงไหม
        // ✅ ใช้วิธีที่ปลอดภัยกว่าด้วย findById
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + user.getId()));

        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // ❌ ถ้าไม่เจอ user, return 404
        }
        System.out.println(existingUser.getId());
        System.out.println(existingUser.getUsername());
        System.out.println(existingUser.getBio());
        System.out.println(existingUser.getGender());
        System.out.println(existingUser.getLocation());
        System.out.println(existingUser.getBirthday());
        System.out.println(existingUser.getImageProfile());
        System.out.println(existingUser.getCoverImage());

        // อัปเดตเฉพาะฟิลด์ที่มีค่า (ป้องกัน null ทับของเดิม)
        if (user.getUsername() != null)
            existingUser.setUsername(user.getUsername());
        if (user.getBio() != null)
            existingUser.setBio(user.getBio());
        if (user.getGender() != null)
            existingUser.setGender(user.getGender());
        if (user.getLocation() != null)
            existingUser.setLocation(user.getLocation());
        if (user.getBirthday() != null)
            existingUser.setBirthday(user.getBirthday());

        // บันทึกข้อมูลที่อัปเดตแล้ว
        User updatedUser = userService.updateUserProfile(existingUser);

        return ResponseEntity.ok(updatedUser); // ✅ คืนค่าเป็น User
        // return ResponseEntity.ok(existingUser); // ✅ คืนค่าเป็น User
    }

    // ✅ ลบผู้ใช้
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/upload-profile")
    public ResponseEntity<String> uploadProfileImage(@PathVariable Integer userId,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty.");
            }

            // ✅ ดึงนามสกุลไฟล์ เช่น ".png", ".jpg"
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // ✅ สร้างชื่อไฟล์ใหม่แบบสุ่ม เช่น "profile_1_9f3d6a7b.png"
            String filename = "profile_" + userId + "_" + UUID.randomUUID() + extension;
            Path path = Paths.get(UPLOAD_DIR + filename);

            // ✅ บันทึกไฟล์ลงโฟลเดอร์ `public/assets/`
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // ✅ เก็บ Path ของไฟล์ลงฐานข้อมูล เช่น "/assets/profile_1_xxx.png"
            String filePath = "/assets/" + filename;
            System.out.println(filePath);
            userService.updateProfileImage(userId, filePath); // ✅ บันทึกลง DB

            return ResponseEntity.ok(filePath); // ✅ ส่ง Path กลับไปให้ Frontend ใช้
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}/upload-cover")
    public ResponseEntity<String> uploadCoverImage(@PathVariable Integer userId,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty.");
            }

            // ✅ ดึงนามสกุลไฟล์ เช่น ".png", ".jpg"
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // ✅ สร้างชื่อไฟล์ใหม่แบบสุ่ม เช่น "profile_1_9f3d6a7b.png"
            String filename = "profile_" + userId + "_" + UUID.randomUUID() + extension;
            Path path = Paths.get(UPLOAD_DIR + filename);

            // ✅ บันทึกไฟล์ลงโฟลเดอร์ `public/assets/`
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // ✅ เก็บ Path ของไฟล์ลงฐานข้อมูล เช่น "/assets/profile_1_xxx.png"
            String filePath = "/assets/" + filename;
            userService.updateCoverImage(userId, filePath); // ✅ ใช้เมธอดใหม่

            return ResponseEntity.ok(filePath);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }

}
