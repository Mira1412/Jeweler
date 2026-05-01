package com.rainbowforest.userservice.controller;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.http.header.HeaderGenerator;
import com.rainbowforest.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
// Sửa javax thành jakarta tại đây
import jakarta.servlet.http.HttpServletRequest; 

@RestController
public class RegisterController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private HeaderGenerator headerGenerator;
    
    @PostMapping(value = "/registration")
    public ResponseEntity<User> addUser(@RequestBody User user, HttpServletRequest request){
        if(user != null)
            try {
                userService.saveUser(user);
                return new ResponseEntity<User>(
                        user,
                        headerGenerator.getHeadersForSuccessPostMethod(request, user.getId()),
                        HttpStatus.CREATED);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<User>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<User>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request){
        if(loginRequest != null && loginRequest.getUserName() != null && loginRequest.getUserPassword() != null) {
            try {
                User user = userService.getUserByName(loginRequest.getUserName());
                if(user != null && user.getUserPassword().equals(loginRequest.getUserPassword()) && user.getActive() == 1) {
                    return new ResponseEntity<User>(
                            user,
                            headerGenerator.getHeadersForSuccessGetMethod(),
                            HttpStatus.OK);
                } else {
                    return new ResponseEntity<User>(
                            headerGenerator.getHeadersForError(),
                            HttpStatus.UNAUTHORIZED);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<User>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<User>(HttpStatus.BAD_REQUEST);
    }

    // Inner class for login request
    public static class LoginRequest {
        private String userName;
        private String userPassword;

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getUserPassword() { return userPassword; }
        public void setUserPassword(String userPassword) { this.userPassword = userPassword; }
    }
}