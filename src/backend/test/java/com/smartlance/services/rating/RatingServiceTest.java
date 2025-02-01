package com.smartlance.services.rating;

import com.smartlance.models.Rating;
import com.smartlance.models.RatingDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @InjectMocks
    private RatingService ratingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddRating_Success() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setAddress("0x123");
        ratingDto.setRating(200);
        ratingDto.setComment("Great job!");

        Rating existingRating = new Rating();
        existingRating.setUserId("0x123");
        existingRating.setTotalRating(500);
        existingRating.setRatingCount(2);

        when(ratingRepository.findById("0x123")).thenReturn(Optional.of(existingRating));
        when(ratingRepository.save(any(Rating.class))).thenReturn(existingRating);

        Rating updatedRating = ratingService.addRating(ratingDto);

        assertNotNull(updatedRating);
        assertEquals("0x123", updatedRating.getUserId());
        assertEquals(700, updatedRating.getTotalRating());
        assertEquals(3, updatedRating.getRatingCount());
        assertTrue(updatedRating.getComments().contains("Great job!"));
    }

    @Test
    void testAddRating_ValidationFailsAddress() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setAddress("");
        ratingDto.setRating(200);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            ratingService.addRating(ratingDto);
        });

        assertEquals("Address can't be empty", exception.getMessage());
    }
    @Test
    void testAddRating_ValidationFailsRating() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setAddress("some");
        ratingDto.setRating(99);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            ratingService.addRating(ratingDto);
        });

        assertEquals("Rating should be between 100 and 500", exception.getMessage());
    }
    @Test
    void testAddRating_ValidationFailsComment() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setAddress("some");
        ratingDto.setRating(200);
        ratingDto.setComment("");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            ratingService.addRating(ratingDto);
        });

        assertEquals("Comment can't be empty", exception.getMessage());
    }

    @Test
    void testAddRating_InvalidRating() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setAddress("0x123");
        ratingDto.setRating(50); // Invalid rating

        Exception exception = assertThrows(RuntimeException.class, () -> {
            ratingService.addRating(ratingDto);
        });

        assertEquals("Rating should be between 100 and 500", exception.getMessage());
    }

    @Test
    void testGetRatings_Found() {
        Rating rating = new Rating();
        rating.setUserId("0x123");
        rating.setTotalRating(500);
        rating.setRatingCount(2);

        when(ratingRepository.findById("0x123")).thenReturn(Optional.of(rating));

        Optional<Rating> result = ratingService.getRatings("0x123");

        assertTrue(result.isPresent());
        assertEquals(500, result.get().getTotalRating());
    }

    @Test
    void testGetRatings_NotFound() {
        when(ratingRepository.findById("0x123")).thenReturn(Optional.empty());

        Optional<Rating> result = ratingService.getRatings("0x123");

        assertFalse(result.isPresent());
    }

    @Test
    void testGetAverageRating_Success() {
        Rating rating = new Rating();
        rating.setUserId("0x123");
        rating.setTotalRating(500);
        rating.setRatingCount(2);

        when(ratingRepository.findById("0x123")).thenReturn(Optional.of(rating));

        int averageRating = ratingService.getAverageRating("0x123");

        assertEquals(250, averageRating);
    }

    @Test
    void testGetAverageRating_UserNotFound() {
        when(ratingRepository.findById("0x123")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            ratingService.getAverageRating("0x123");
        });

        assertEquals("User has no ratings", exception.getMessage());
    }
}
