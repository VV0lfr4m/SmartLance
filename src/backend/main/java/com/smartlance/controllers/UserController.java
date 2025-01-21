package com.smartlance.controllers;

import com.smartlance.blockchain.UserRegistryService;
import com.smartlance.models.User;
import com.smartlance.services.user.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    private final IUserService userService;
    private final UserRegistryService userRegistryService;

    public UserController(IUserService userService, UserRegistryService userRegistryService) {
        this.userService = userService;
        this.userRegistryService = userRegistryService;
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

    @GetMapping("/sync")
    public ResponseEntity<String> syncUserData(@RequestParam String transactionHash) {
        try {
            userRegistryService.syncUserData(transactionHash);
            return ResponseEntity.ok("User data synchronized successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error during synchronization: " + e.getMessage());
        }
    }
}
