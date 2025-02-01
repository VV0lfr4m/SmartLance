package com.smartlance.services.rating;

import com.smartlance.models.Rating;
import com.smartlance.models.RatingDto;


import java.util.List;
import java.util.Optional;

public interface IRatingService {
    Rating addRating(RatingDto ratingDto);
    Optional<Rating> getRatings(String address);
    Integer getAverageRating(String address);
}
