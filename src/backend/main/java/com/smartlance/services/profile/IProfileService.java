package com.smartlance.services.profile;

import com.smartlance.models.Profile;

public interface IProfileService {
    void createProfile(Profile profile) throws Exception;
    Profile updateProfile(Profile profile) throws Exception;
    Profile getProfile(String walletAddress) throws Exception;
}
