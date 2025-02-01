package com.smartlance.controllers;

import com.smartlance.models.Rating;
import com.smartlance.models.RatingDto;
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
    public ResponseEntity<Rating> addRating(@RequestBody RatingDto ratingDto) {
        Rating updatedRating = ratingService.addRating(ratingDto);
        return ResponseEntity.ok(updatedRating);
    }

    @GetMapping("/{address}")
    public ResponseEntity<Rating> getRatings(@PathVariable String address) {
        Optional<Rating> rating = ratingService.getRatings(address);
        return rating.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{address}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable String address) {
        double averageRating = ratingService.getAverageRating(address);
        return ResponseEntity.ok(averageRating);
    }
}
