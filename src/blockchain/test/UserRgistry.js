const {expect} = require("chai");
const {ethers, network} = require("hardhat");


describe("UserRegistry", () => {

    let owner;
    let seller;
    let buyer;
    let smartContract;

    beforeEach(async () => {
        [owner, seller, buyer] = await ethers.getSigners();
        const SmartContract = await ethers.getContractFactory("UserRegistry", owner);
        smartContract = await SmartContract.deploy();
        await smartContract.deploymentTransaction().wait();

        console.log("UserRegistry Contract successful deployed with address: ", smartContract.target);
    })

    describe("isUserRegistered", () => {
        it("Should return true for registered user", async () => {
            await smartContract.connect(owner).registerUser("TestName", "testLink");
            expect(await smartContract.isUserRegistered(owner)).to.be.true;
        })
        it("Should return false for non registered user", async () => {
            expect(await smartContract.isUserRegistered(owner)).to.be.false;
        })
    })

    describe("getUserInfo", () => {
        it("Should return registered user info", async () => {
            let testName = "TestName";
            let testBio = "testBio";
            await smartContract.connect(owner).registerUser(testName, testBio);
            let username;
            let bio;
            [username, bio] = await smartContract.getUserInfo(owner);
            expect(username).to.eq(testName);
            expect(bio).to.eq(testBio);

        })
        it("Should throw error User is not registered!", async () => {
            await expect(smartContract.getUserInfo(owner)).to.be.revertedWith("getUserInfo(): User is not registered!");
        })
    })

    describe("registerUser", () => {
        it("Should register user and emit event", async () => {
            let testName = "TestName";
            let testBio = "testBio";

            let tx = await smartContract.connect(owner).registerUser(testName, testBio);
            let savedUser = await smartContract.getUserInfo(owner.address);

            expect(testName).to.eq(savedUser[0]);
            expect(testBio).to.eq(savedUser[1]);

            await expect(tx).to
                .emit(smartContract, "UserRegistered")
                .withArgs(owner, testName);

        })
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