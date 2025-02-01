package com.smartlance.services.profile;

import com.smartlance.models.Profile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private ProfileService profileService;

    private Profile profile;

    @BeforeEach
    void setUp() {
        profile = new Profile();
        profile.setId("0x123");
        profile.setUsername("Alice");
        profile.setBio("Alice's bio");
        profile.setAvatarHash("QmHash");
    }

    @Test
    void shouldCreateProfileSuccessfully() throws Exception {
        profileService.createProfile(profile);

        verify(profileRepository, times(1)).save(profile);
    }

    @Test
    void shouldThrowExceptionWhenUsernameIsEmpty() {
        profile.setUsername("");

        assertThatThrownBy(() -> profileService.createProfile(profile))
                .isInstanceOf(Exception.class)
                .hasMessage("Username can't be empty!");

        verify(profileRepository, never()).save(any());
    }

    @Test
    void shouldThrowExceptionWhenWalletAddressIsEmpty() {
        profile.setId("");

        assertThatThrownBy(() -> profileService.createProfile(profile))
                .isInstanceOf(Exception.class)
                .hasMessage("Address can't be empty!");

        verify(profileRepository, never()).save(any());
    }

    @Test
    void shouldUpdateProfileSuccessfully() throws Exception {
        when(profileRepository.findById(profile.getId())).thenReturn(Optional.of(profile));
        when(profileRepository.save(profile)).thenReturn(profile);

        Profile updatedProfile = new Profile();
        updatedProfile.setId("0x123");
        updatedProfile.setUsername("Bob");
        updatedProfile.setBio("Bob's new bio");
        updatedProfile.setAvatarHash("QmNewHash");

        Profile result = profileService.updateProfile(updatedProfile);

        assertThat(result.getUsername()).isEqualTo("Bob");
        assertThat(result.getBio()).isEqualTo("Bob's new bio");
        assertThat(result.getAvatarHash()).isEqualTo("QmNewHash");

        verify(profileRepository, times(1)).save(profile);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonExistingProfile() {
        when(profileRepository.findById("0x999")).thenReturn(Optional.empty());

        Profile updatedProfile = new Profile();
        updatedProfile.setId("0x999");
        updatedProfile.setUsername("Charlie");

        assertThatThrownBy(() -> profileService.updateProfile(updatedProfile))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Profile not found");

        verify(profileRepository, never()).save(any());
    }

    @Test
    void shouldGetProfileSuccessfully() throws Exception {
        when(profileRepository.findById(profile.getId())).thenReturn(Optional.of(profile));

        Profile result = profileService.getProfile("0x123");

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("Alice");

        verify(profileRepository, times(1)).findById("0x123");
    }

    @Test
    void shouldThrowExceptionWhenProfileNotFound() {
        when(profileRepository.findById("0x999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.getProfile("0x999"))
                .isInstanceOf(Exception.class)
                .hasMessage("No profiles found");

        verify(profileRepository, times(1)).findById("0x999");
    }

    @Test
    void shouldThrowExceptionWhenWalletAddressIsEmptyForGetProfile() {
        assertThatThrownBy(() -> profileService.getProfile(""))
                .isInstanceOf(Exception.class)
                .hasMessage("Address can't be empty!");

        verify(profileRepository, never()).findById(any());
    }
}
