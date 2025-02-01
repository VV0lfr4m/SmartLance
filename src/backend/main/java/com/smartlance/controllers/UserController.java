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


    //+
    @PostMapping
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    //+
    @GetMapping("/{address}")
    public ResponseEntity<User> getUserByAddress(@PathVariable String address) {
        Optional<User> user = userService.getUserByAddress(address);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    //+
    @GetMapping("/{address}/isRegistered")
    public ResponseEntity<Boolean> isUserRegistered(@PathVariable String address) {
        boolean registered = userService.isUserRegistered(address);
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
