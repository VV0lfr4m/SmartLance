const {expect} = require("chai");
const {ethers, waffle} = require("hardhat");


describe("RatingManager", () => {

    let owner;
    let executor;
    let smartContract;

    beforeEach(async () => {
        [owner, executor] = await ethers.getSigners();
        smartContract = await ethers.deployContract("RatingManager");
    })

    describe("giveRating", () => {
        it("Should add review for executor and emit event", async () => {
            let userAddress = executor.address;
            let rating = 500;
            let comment = "test"
            let tx = await smartContract.connect(owner).giveRating(userAddress, rating, comment);
            let reviewResponse = await smartContract.getReviews(userAddress);

            expect(reviewResponse.totalRating).to.be.eq(rating);
            expect(reviewResponse.ratingCount).to.be.eq(1);
            expect(reviewResponse.comments[0]).to.be.eq(comment);
            expect(reviewResponse.commentCount).to.be.eq(1);
            expect(reviewResponse.reviewer).to.be.eq(owner.address);

            expect(tx)
                .to.emit(smartContract, "RatingGiven")
                .withArgs(owner.address, userAddress, rating, comment);
        })
        it("Should revert with RatingManager.giveRating: Invalid user", async () => {
            let userAddress = ethers.constants.AddressZero;
            let rating = 500;
            let comment = "test"
            let tx = smartContract.connect(owner).giveRating(userAddress, rating, comment);

            await expect(tx).to.be.revertedWith("RatingManager.giveRating: Invalid user");
        })
        it("Should revert with RatingManager.giveRating: You can't review yourself", async () => {
            let userAddress = executor.address;
            let rating = 500;
            let comment = "test"
            let tx = smartContract.connect(executor).giveRating(userAddress, rating, comment);

            await expect(tx).to.be.revertedWith("RatingManager.giveRating: You can't review yourself");
        })
        it("Should revert with RatingManager.giveRating: Rating must be between 1.00 and 5.00", async () => {
            let userAddress = executor.address;
            let rating = 90;
            let comment = "test"
            let tx = smartContract.connect(owner).giveRating(userAddress, rating, comment);

            await expect(tx).to.be.revertedWith("RatingManager.giveRating: Rating must be between 1.00 and 5.00");
        })

    });

    describe("getReviews", () => {
        it("Should return review of an executor", async () => {
            let userAddress = executor.address;
            let rating = 500;
            let comment = "test"
            let tx = await smartContract.connect(owner).giveRating(userAddress, rating, comment);
            let reviewResponse = await smartContract.getReviews(userAddress);

            expect(reviewResponse.totalRating).to.be.eq(rating);
            expect(reviewResponse.ratingCount).to.be.eq(1);
            expect(reviewResponse.comments[0]).to.be.eq(comment);
            expect(reviewResponse.commentCount).to.be.eq(1);
            expect(reviewResponse.reviewer).to.be.eq(owner.address);
        })
    });

    describe("getAverageRating", () => {
        it("Should get average rating of an executor", async () => {
            let userAddress = executor.address;
            let rating = 500;
            let comment = "test"
            let tx = await smartContract.connect(owner).giveRating(userAddress, rating, comment);
            let avgResponse = await smartContract.getAverageRating(userAddress);

            expect(avgResponse).to.be.eq(rating/1);
        })
        it("Should revert with RatingManager.getAverageRating: No ratings yet", async () => {
            let userAddress = executor.address;
            await expect(smartContract.getAverageRating(userAddress)).to.be
                .revertedWith("RatingManager.getAverageRating: No ratings yet");
        })
    });

    describe("getRatingCount", () => {
        it("Should get rating count", async () => {
            let userAddress = executor.address;
            let rating = 500;
            let comment = "test"
            let tx = await smartContract.connect(owner).giveRating(userAddress, rating, comment);
            let response = await smartContract.getRatingCount(userAddress);
            expect(response).to.be.eq(1);
        })
    });

    describe("getComments", () => {
        it("Should return array of comments", async () => {
            let userAddress = executor.address;
            let rating = 500;
            let comment = "test"
            let tx = await smartContract.connect(owner).giveRating(userAddress, rating, comment);
            let response = await smartContract.getComments(userAddress);

            expect(response.length).to.be.eq(1);
            expect(response[0]).to.be.eq(comment);
        })
    });
});