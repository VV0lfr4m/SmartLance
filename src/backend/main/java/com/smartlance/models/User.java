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

    @Column(nullable = false)
    private String bioLink;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBioLink() {
        return bioLink;
    }

    public void setBioLink(String bioLink) {
        this.bioLink = bioLink;
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