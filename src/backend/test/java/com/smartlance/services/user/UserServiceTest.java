package com.smartlance.services.user;

import com.smartlance.models.User;
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
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("0x123");
        user.setUsername("Alice");
        user.setBio("Alice's bio");
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        when(userRepository.existsById(user.getId())).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        User registeredUser = userService.registerUser(user);

        assertThat(registeredUser).isNotNull();
        assertThat(registeredUser.getBioLink()).isEqualTo("link_generated");

        verify(userRepository, times(1)).existsById(user.getId());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void shouldThrowExceptionIfUserAlreadyRegistered() {
        when(userRepository.existsById(user.getId())).thenReturn(true);

        assertThatThrownBy(() -> userService.registerUser(user))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User already registered");

        verify(userRepository, times(1)).existsById(user.getId());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldReturnUserByAddress() {
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        Optional<User> foundUser = userService.getUserByAddress(user.getId());

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUsername()).isEqualTo("Alice");

        verify(userRepository, times(1)).findById(user.getId());
    }

    @Test
    void shouldReturnEmptyIfUserNotFound() {
        when(userRepository.findById(user.getId())).thenReturn(Optional.empty());

        Optional<User> foundUser = userService.getUserByAddress(user.getId());

        assertThat(foundUser).isEmpty();

        verify(userRepository, times(1)).findById(user.getId());
    }

    @Test
    void shouldReturnTrueIfUserIsRegistered() {
        when(userRepository.existsById(user.getId())).thenReturn(true);

        boolean isRegistered = userService.isUserRegistered(user.getId());

        assertThat(isRegistered).isTrue();

        verify(userRepository, times(1)).existsById(user.getId());
    }

    @Test
    void shouldReturnFalseIfUserIsNotRegistered() {
        when(userRepository.existsById(user.getId())).thenReturn(false);

        boolean isRegistered = userService.isUserRegistered(user.getId());

        assertThat(isRegistered).isFalse();

        verify(userRepository, times(1)).existsById(user.getId());
    }

    @Test
    void shouldUpdateUserSuccessfully() {
        when(userRepository.save(user)).thenReturn(user);

        User updatedUser = userService.updateUser(user);

        assertThat(updatedUser).isNotNull();
        assertThat(updatedUser.getUsername()).isEqualTo("Alice");

        verify(userRepository, times(1)).save(user);
    }
}
