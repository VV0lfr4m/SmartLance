package com.smartlance.services.user;

import com.smartlance.models.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements IUserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        if (userRepository.existsById(user.getId())) {
            throw new RuntimeException("User already registered");
        }
        //todo set a link to bio page
        user.setBioFull(user.getBio());
        user.setBio("link_generated");
        return userRepository.save(user);
    }

    public Optional<User> getUserByAddress(String address) {
        return userRepository.findById(address);
    }

    public boolean isUserRegistered(String id) {
        return userRepository.existsById(id);
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }
}
