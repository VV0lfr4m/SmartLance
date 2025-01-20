const {expect} = require("chai");
const {ethers, waffle} = require("hardhat");


describe("UserRegistry", () => {

    let owner;
    let seller;
    let buyer;
    let smartContract;

    beforeEach(async () => {
        [owner, seller, buyer] = await ethers.getSigners();
        smartContract = await ethers.deployContract("UserRegistry");
    })

    describe("isUserRegistered", () => {
        it("Should return true for registered user", async () => {
            await smartContract.connect(owner).registerUser("TestName", "testLink");
            expect(await smartContract.isUserRegistered(owner.address)).to.be.true;
        })
        it("Should return false for non registered user", async () => {
            expect(await smartContract.isUserRegistered(owner.address)).to.be.false;
        })
    })

    describe("getUserInfo", () => {
        it("Should return registered user info", async () => {
            let testName = "TestName";
            let testBio = "testBio";
            await smartContract.connect(owner).registerUser(testName, testBio);
            let username;
            let bio;
            [username, bio] = await smartContract.getUserInfo(owner.address);
            expect(username).to.eq(testName);
            expect(bio).to.eq(testBio);

        })
        it("Should throw error User is not registered!", async () => {
            await expect(smartContract.getUserInfo(owner.address)).to.be.revertedWith("getUserInfo(): User is not registered!");
        })
    })

    describe("registerUser", () => {
        it("Should register user and emit event", async () => {
            let testName = "TestName";
            let testBio = "testBio";

            // Register the user
            let tx = await smartContract.connect(owner).registerUser(testName, testBio);
            await tx.wait();  // Ensure the transaction is mined

            // Retrieve the saved user information
            let savedUser = await smartContract.getUserInfo(owner.address);

            // Verify user information
            expect(savedUser[0]).to.eq(testName);
            expect(savedUser[1]).to.eq(testBio);

            // Check if the event was emitted correctly
             expect(tx)
                .to.emit(smartContract, "UserRegistered")
                .withArgs(owner.address, testName);
        });
        it("Should throw error registerUser(): User already registered!", async () => {
            let testName = "TestName";
            let testBio = "testBio";

            await smartContract.connect(owner).registerUser(testName, testBio);

            let secondRegisterTx = smartContract.connect(owner).registerUser(testName, testBio);

            await expect(secondRegisterTx).to.be.revertedWith("registerUser(): User already registered!");
        })
        it("Should throw error registerUser(): username can't be empty", async () => {
            let testName = "";
            let testBio = "testBio";

            let registerTx = smartContract.connect(owner).registerUser(testName, testBio);

            await expect(registerTx).to.be.revertedWith("registerUser(): username can't be empty");
        })
    })

})