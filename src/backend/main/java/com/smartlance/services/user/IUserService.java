package com.smartlance.services.user;

import com.smartlance.models.User;

import java.util.Optional;

public interface IUserService {
    User registerUser(User user);
    Optional<User> getUserById(String id);
    boolean isUserRegistered(String id);
}
