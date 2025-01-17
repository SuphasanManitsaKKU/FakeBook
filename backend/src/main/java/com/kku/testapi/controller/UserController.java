package com.kku.testapi.controller;

import com.kku.testapi.entity.User;
import com.kku.testapi.service.UserService;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String home() {
        return "Hello World";
    }

    @GetMapping("/test")
    public String fff() {
        return "Hello World-----------------";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        System.out.println("--------------------------------------------------1");
        String token = this.userService.login(user.getUsername(), user.getPassword());
        System.out.println("--------------------------------------------------2");
        // สร้าง Cookie สำหรับ JWT
        ResponseCookie jwtCookie = ResponseCookie.from("token", token)
                // .httpOnly(true) // ป้องกันการเข้าถึงจาก JavaScript
                .secure(false) // เปลี่ยนเป็น true ใน Production (HTTPS)
                .path("/")
                .maxAge(24 * 60 * 60) // อายุ 1 วัน
                .build();
        System.out.println("--------------------------------------------------3");
        // ส่ง Response พร้อม Cookie
        return ResponseEntity.ok()
                .header("Set-Cookie", jwtCookie.toString())
                .body(Map.of("message", "Login successful"));
    }

    @PostMapping("/logout")
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
    public String register(@RequestBody User user) {
        System.out.println("--------------------------------------------------");
        return this.userService.register(user);
    }

    // @PostMapping("/user")
    // public User addUser(@RequestBody User user) {
    // user.setId(0);
    // return this.userService.save(user);
    // }

    // @GetMapping("/user")
    // public List<User> getAllUser() {
    // return this.userService.findAll();
    // }

    // @GetMapping("/user/{id}")
    // public User getUserById(@PathVariable int id) {
    // return this.userService.findById(id);
    // }

    // @PutMapping("/user")
    // public User updateUser(@RequestBody User user) {
    // return this.userService.update(user);
    // }

    // @DeleteMapping("/user/{id}")
    // public String deleteUserById(@PathVariable int id) {
    // this.userService.deleteById(id);
    // return "Deleted user id: " + id;
    // }

}
