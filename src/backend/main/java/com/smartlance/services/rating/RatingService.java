package com.smartlance.services.rating;


import com.smartlance.models.Rating;
import com.smartlance.models.RatingDto;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class RatingService implements IRatingService {
    private RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public Rating addRating(RatingDto ratingDto) {
        validateInput(ratingDto);
        Rating ratingEntity = ratingRepository.findById(ratingDto.getAddress()).orElse(new Rating());
        ratingEntity.setUserId(ratingDto.getAddress());
        ratingEntity.setTotalRating(ratingEntity.getTotalRating() + ratingDto.getRating());
        ratingEntity.setRatingCount(ratingEntity.getRatingCount() + 1);
        ratingEntity.getComments().add(ratingDto.getComment());
        return ratingRepository.save(ratingEntity);
    }

    private void validateInput(RatingDto ratingDto) {
        if(ratingDto.getAddress().isEmpty()) {
            throw new RuntimeException("Address can't be empty");
        }
        if (ratingDto.getRating() < 100 || ratingDto.getRating() > 500) {
            throw new RuntimeException("Rating should be between 100 and 500");
        }
        if(ratingDto.getComment().isEmpty()) {
            throw new RuntimeException("Comment can't be empty");
        }
    }

    public Optional<Rating> getRatings(String address) {
        return ratingRepository.findById(address);
    }

    public Integer getAverageRating(String address) {
        Rating rating = ratingRepository.findById(address)
                .orElseThrow(() -> new RuntimeException("User has no ratings"));
        return (Integer) rating.getTotalRating() / rating.getRatingCount();
    }
}
