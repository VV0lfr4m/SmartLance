package com.smartlance.controllers;

import com.smartlance.models.User;
import com.smartlance.services.user.IUserService;
import com.smartlance.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    private IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }


    @PostMapping
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/isRegistered")
    public ResponseEntity<Boolean> isUserRegistered(@PathVariable String id) {
        boolean registered = userService.isUserRegistered(id);
        return ResponseEntity.ok(registered);
    }
}
