// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract RatingManager {
    mapping(address => Review) private reviews;

    struct Review {
        uint totalRating;
        uint ratingCount;
        mapping(uint => string) comments;
        uint commentCount;
        address reviewer;
    }

    event RatingGiven(address reviewer, address indexed user, uint rating, string comment);

    function giveRating(address _user, uint _rating, string calldata _comment) external {
        require(_user != address(0), "RatingManager.giveRating: Invalid user");
        require(_user != msg.sender, "RatingManager.giveRating: You can't review yourself");
        require(_rating >= 100 && _rating <= 500, "RatingManager.giveRating: Rating must be between 1.00 and 5.00");

        Review storage review = reviews[_user];
        review.totalRating += _rating;
        review.ratingCount++;
        review.comments[review.commentCount] = _comment;
        review.commentCount++;
        review.reviewer = msg.sender;

        emit RatingGiven(msg.sender, _user, _rating, _comment);
    }

    function getReviews(address _user) public view returns (
        uint totalRating,
        uint ratingCount,
        string[] memory comments,
        uint commentCount,
        address reviewer) {

        Review storage review = reviews[_user];
        return (
        review.totalRating,
        review.ratingCount,
        getComments(_user),
        review.commentCount,
        review.reviewer
        );
    }

    function getAverageRating(address _user) external view returns (uint) {
        Review storage review = reviews[_user];
        require(review.ratingCount > 0, "RatingManager.getAverageRating: No ratings yet");

        return review.totalRating / review.ratingCount;
    }

    function getRatingCount(address _user) external view returns (uint) {
        return reviews[_user].ratingCount;
    }

    function getComments(address _user) public view returns (string[] memory) {
        Review storage review = reviews[_user];
        string[] memory comments = new string[](review.commentCount);

        for (uint i = 0; i < review.commentCount; i++) {
            comments[i] = review.comments[i];
        }

        return comments;
    }
}
