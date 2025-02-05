package com.kku.testapi.service;


import java.util.List;

import com.kku.testapi.entity.User;

public interface UserService {
    User login(String username, String password);
    String register(User user);
    List<User> searchByUsername(String username); // คืนค่าเป็น List<User>
    User getUserById(Integer id);
    List<User> getAllUsers();
    User updateUserProfile(User updatedUser);
    void deleteUser(Integer id);
}
