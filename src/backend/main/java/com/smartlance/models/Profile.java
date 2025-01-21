package com.smartlance.models;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @Column(nullable = false, unique = true)
    private String id;//user wallet address
    @Column(nullable = false, unique = true)
    private String username;
    private String bio;
    private String avatarHash;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarHash() {
        return avatarHash;
    }

    public void setAvatarHash(String avatarHash) {
        this.avatarHash = avatarHash;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Profile profile = (Profile) o;
        return Objects.equals(id, profile.id) && Objects.equals(username, profile.username) && Objects.equals(bio, profile.bio) && Objects.equals(avatarHash, profile.avatarHash);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, bio, avatarHash);
    }
}
