package com.smartlance.services.rating;

import com.smartlance.models.Rating;


import java.util.List;
import java.util.Optional;

public interface IRatingService {
    Rating addRating(String userId, int rating, String comment);
    Optional<Rating> getRatings(String userId);
    Integer getAverageRating(String userId);
}
