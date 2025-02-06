package com.smartlance.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    private String id; // Ethereum address of the user

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String bio;

    @Column(name = "boi_link")
    private String bioFull;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBioFull() {
        return bioFull;
    }

    public void setBioFull(String bioFull) {
        this.bioFull = bioFull;
    }

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
}