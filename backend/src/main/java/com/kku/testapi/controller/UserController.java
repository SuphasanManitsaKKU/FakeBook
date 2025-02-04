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

    @GetMapping("/sendNotification")
    public String sendNotification(@RequestBody NotificationRequestDto request) {
        messagingTemplate.convertAndSend("/notification/messages/" + request.getUserId(), request.getMessage());
        return request.getUserId() + " : " + request.getMessage();
    }

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("")
    public String home() {
        return "Hello World";
    }

    @GetMapping("/test")
    public String fff() {
        return "Hello World test";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User userLogin = this.userService.login(user.getUsername(), user.getPassword());
        // สร้าง JWT Token
        String token = JwtUtil.generateToken(String.valueOf(userLogin.getId()), userLogin.getUsername());

        // สร้าง Cookie สำหรับ JWT
        ResponseCookie jwtCookie = ResponseCookie.from("token", token)
                // .httpOnly(true) // ป้องกันการเข้าถึงจาก JavaScript
                .secure(false) // เปลี่ยนเป็น true ใน Production (HTTPS)
                .path("/")
                .maxAge(24 * 60 * 60) // อายุ 1 วัน
                .build();

        // ส่ง Response พร้อม Cookie
        return ResponseEntity.ok()
                .header("Set-Cookie", jwtCookie.toString())
                .body(Map.of("message", "Login successful"));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout() {
        // สร้าง Cookie สำหรับลบ JWT
        ResponseCookie jwtCookie = ResponseCookie.from("token", "")
                .httpOnly(true) // ป้องกันการเข้าถึงจาก JavaScript
                .secure(false) // เปลี่ยนเป็น true ใน Production (HTTPS)
                .path("/")
                .maxAge(0) // ตั้งอายุให้เป็น 0 เพื่อให้ Cookie หมดอายุ
                .build();

        // ส่ง Response พร้อม Cookie ที่ถูกลบ
        return ResponseEntity.ok()
                .header("Set-Cookie", jwtCookie.toString())
                .body(Map.of("message", "Logout successful"));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        this.userService.register(user);

        // ส่งคำตอบกลับในรูปแบบ JSON
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String username) {
        return userService.searchByUsername(username);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers(); // เรียกใช้งาน Service
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

}