package com.smartlance.controllers;

import com.smartlance.models.Profile;
import com.smartlance.services.profile.IProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
public class ProfileController {
    private IProfileService profileService;

    public ProfileController(IProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity createProfile(@RequestBody Profile profile) throws Exception {
        profileService.createProfile(profile);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{address}")
    public ResponseEntity<Profile> updateProfile(@RequestBody Profile profile, @PathVariable String address) throws Exception {
        return ResponseEntity.ok(profileService.updateProfile(profile));
    }

    @GetMapping("/{address}")
    public ResponseEntity<Profile> getProfile(@PathVariable String address) throws Exception {
        return ResponseEntity.ok(profileService.getProfile(address));
    }
}
