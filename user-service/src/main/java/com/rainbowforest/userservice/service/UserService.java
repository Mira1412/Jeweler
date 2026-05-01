package com.rainbowforest.userservice.service;

import java.util.List;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.UserRole;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User getUserByName(String userName);
    User saveUser(User user);
    void deleteUser(Long id);
    UserRole getRoleByName(String roleName);
}
