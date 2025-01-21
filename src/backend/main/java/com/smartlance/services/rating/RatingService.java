package com.smartlance.services.rating;


import com.smartlance.models.Rating;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RatingService implements IRatingService {
    private RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public Rating addRating(String userId, int rating, String comment) {
        Rating ratingEntity = ratingRepository.findById(userId).orElse(new Rating());
        ratingEntity.setUserId(userId);
        ratingEntity.setTotalRating(ratingEntity.getTotalRating() + rating);
        ratingEntity.setRatingCount(ratingEntity.getRatingCount() + 1);
        ratingEntity.getComments().add(comment);
        return ratingRepository.save(ratingEntity);
    }

    public Optional<Rating> getRatings(String userId) {
        return ratingRepository.findById(userId);
    }

    public Integer getAverageRating(String userId) {
        Rating rating = ratingRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User has no ratings"));
        return (Integer) rating.getTotalRating() / rating.getRatingCount();
    }
}
