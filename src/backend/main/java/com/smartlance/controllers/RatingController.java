package com.smartlance.controllers;

import com.smartlance.models.Rating;
import com.smartlance.services.rating.IRatingService;
import com.smartlance.services.rating.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/ratings")
public class RatingController {
    private IRatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> addRating(
            @RequestParam String userId,
            @RequestParam int rating,
            @RequestParam String comment
    ) {
        Rating updatedRating = ratingService.addRating(userId, rating, comment);
        return ResponseEntity.ok(updatedRating);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Rating> getRatings(@PathVariable String userId) {
        Optional<Rating> rating = ratingService.getRatings(userId);
        return rating.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable String userId) {
        double averageRating = ratingService.getAverageRating(userId);
        return ResponseEntity.ok(averageRating);
    }
}
