package com.rainbowforest.userservice.service;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.UserRole;
import com.rainbowforest.userservice.repository.UserRepository;
import com.rainbowforest.userservice.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.getOne(id);
    }

    @Override
    public User getUserByName(String userName) {
        return userRepository.findByUserName(userName);
    }

    @Override
    public User saveUser(User user) {
        if (user.getActive() == 0) {
            user.setActive(1);
        }
        
        // Nếu user đã có Role (ví dụ được set từ Controller), ta giữ nguyên.
        // Ngược lại nếu Role null thì gán mặc định ROLE_USER.
        if (user.getRole() == null) {
            UserRole role = userRoleRepository.findUserRoleByRoleName("ROLE_USER");
            user.setRole(role);
        }
        
        return userRepository.save(user);
    }

    @Override
    public UserRole getRoleByName(String roleName) {
        return userRoleRepository.findUserRoleByRoleName(roleName);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
