package com.kku.testapi.service;


import com.kku.testapi.entity.User;

public interface UserService {
    String login(String username, String password);
    String register(User user);
    // User save(User user);
    // List<User> findAll();
    // User findById(int id);
    // User update(User user);
    // void deleteById(int id);
}
