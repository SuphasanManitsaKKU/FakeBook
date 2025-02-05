package com.kku.testapi.controller;

import com.kku.testapi.Util.JwtUtil;
import com.kku.testapi.dto.NotificationRequestDto;
import com.kku.testapi.entity.User;
import com.kku.testapi.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserService userService;

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
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // ✅ อัปเดตข้อมูลผู้ใช้
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserProfile(@RequestBody User user) {
        // ตรวจสอบว่ามี User อยู่จริงไหม
        User existingUser = userService.getUserById(user.getId());
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // ❌ ถ้าไม่เจอ user, return 404
        }

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
        if (user.getCoverImage() != null)
            existingUser.setCoverImage(user.getCoverImage());
        if (user.getImageProfile() != null)
            existingUser.setImageProfile(user.getImageProfile());

        // บันทึกข้อมูลที่อัปเดตแล้ว
        User updatedUser = userService.updateUserProfile(existingUser);

        return ResponseEntity.ok(updatedUser); // ✅ คืนค่าเป็น User
    }

    // ✅ ลบผู้ใช้
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
