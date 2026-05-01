package com.rainbowforest.userservice.controller;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.http.header.HeaderGenerator;
import com.rainbowforest.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// Thay đổi quan trọng ở đây: javax -> jakarta
import jakarta.servlet.http.HttpServletRequest; 
import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private HeaderGenerator headerGenerator;
    
    @GetMapping (value = "/users")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users =  userService.getAllUsers();
        if(!users.isEmpty()) {
            return new ResponseEntity<List<User>>(
                users,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
        }
        return new ResponseEntity<List<User>>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/users", params = "name")
    public ResponseEntity<User> getUserByName(@RequestParam("name") String userName){
        User user = userService.getUserByName(userName);
        if(user != null) {
            return new ResponseEntity<User>(
                    user,
                    headerGenerator.
                    getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<User>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id){
        User user = userService.getUserById(id);
        if(user != null) {
            return new ResponseEntity<User>(
                    user,
                    headerGenerator.
                    getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<User>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @PostMapping (value = "/users")
    public ResponseEntity<User> addUser(@RequestBody User user, HttpServletRequest request){
        if(user != null)
            try {
                userService.saveUser(user);
                return new ResponseEntity<User>(
                        user,
                        headerGenerator.getHeadersForSuccessPostMethod(request, user.getId()),
                        HttpStatus.CREATED);
            }catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<User>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<User>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long id, @RequestBody User userUpdate) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Cập nhật các trường cơ bản
        existingUser.setUserName(userUpdate.getUserName());
        
        if (existingUser.getUserDetails() != null && userUpdate.getUserDetails() != null) {
            existingUser.getUserDetails().setEmail(userUpdate.getUserDetails().getEmail());
        }
        
        // Nếu có gửi password mới thì mới cập nhật
        if (userUpdate.getUserPassword() != null && !userUpdate.getUserPassword().isEmpty()) {
            existingUser.setUserPassword(userUpdate.getUserPassword());
        }

        // Xử lý Role (nhận từ adminFormData.role)
        if (userUpdate.getRole() != null && userUpdate.getRole().getRoleName() != null) {
            existingUser.setRole(userService.getRoleByName(userUpdate.getRole().getRoleName()));
        }

        User updatedUser = userService.saveUser(existingUser);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}