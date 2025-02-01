
package com.smartlance.blockchain;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/registry/users")
public class UserRegistryController {

    private final UserRegistryService userRegistryService;

    public UserRegistryController(UserRegistryService userRegistryService) {
        this.userRegistryService = userRegistryService;
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam String username, @RequestParam String bio) {
        try {
            userRegistryService.registerUser(username, bio);
            return "User registered successfully!";
        } catch (Exception e) {
            return "Error registering user: " + e.getMessage();
        }
    }

    @GetMapping("/{userAddress}/bio")
    public String getUserBio(@PathVariable String userAddress) {
        try {
            return userRegistryService.getUserInfo(userAddress);
        } catch (Exception e) {
            return "Error retrieving user bio: " + e.getMessage();
        }
    }
}
