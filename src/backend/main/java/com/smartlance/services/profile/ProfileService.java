package com.smartlance.services.profile;

import com.smartlance.models.Profile;
import org.springframework.stereotype.Service;

@Service
public class ProfileService implements IProfileService {
    private ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public void createProfile(Profile profile) throws Exception {
        validateInput(profile.getUsername(), profile.getId());
        profileRepository.save(profile);
    }

    private void validateInput(String username, String walletAddress) throws Exception {
        if (username.isEmpty()) {
            throw new Exception("Username can't be empty!");
        }
        if (walletAddress.isEmpty()) {
            throw new Exception("Address can't be empty!");
        }
    }

    @Override
    public Profile updateProfile(Profile updatedProfile) throws Exception {
        validateInput(updatedProfile.getUsername(), updatedProfile.getId());
        Profile profile = profileRepository.findById(updatedProfile.getId()).orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setUsername(updatedProfile.getUsername());
        profile.setBio(updatedProfile.getBio());
        profile.setAvatarHash(updatedProfile.getAvatarHash());
        return profileRepository.save(profile);
    }

    @Override
    public Profile getProfile(String walletAddress) throws Exception {
        if (walletAddress.isEmpty()) {
            throw new Exception("Address can't be empty!");
        }
        return profileRepository.findById(walletAddress)
                .orElseThrow(() -> new Exception("No profiles found"));
    }
}
