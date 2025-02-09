package com.kku.testapi.service;

import java.util.List;

import com.kku.testapi.entity.User;

public interface UserService {
    public User login(String username, String password);

    public String register(User user);

    public List<User> searchByUsername(String username); // คืนค่าเป็น List<User>

    public User getUserById(Integer id);

    public List<User> getAllUsers();

    public User updateUserProfile(User updatedUser);

    public void deleteUser(Integer id);

    public void updateProfileImage(Integer userId, String imagePath);

    public void updateCoverImage(Integer userId, String imagePath);

    public User getUserWithBase64Images(Integer id);
}
