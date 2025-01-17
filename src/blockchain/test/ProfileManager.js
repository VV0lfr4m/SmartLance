const {expect} = require("chai");
const {ethers, waffle} = require("hardhat");


describe("ProfileManager", () => {

    let owner;
    let executor;
    let smartContract;

    beforeEach(async () => {
        [owner, executor] = await ethers.getSigners();
        smartContract = await ethers.deployContract("ProfileManager");

        console.log("ProfileManager Contract successful deployed with address: ", smartContract.address);
    })

    describe("createProfile", () => {
        it("Should create and get profile and emit event", async () => {
            let _username = "test";
            let _bio = "bio";
            let _avatarHash = "hash"
            let tx = await smartContract.createProfile(_username, _bio, _avatarHash);
            let profile = await smartContract.getProfile(owner.address);

            expect(profile.username).to.be.eq(_username);
            expect(profile.bio).to.be.eq(_bio);
            expect(profile.avatarHash).to.be.eq(_avatarHash);

            expect(tx)
                .to.emit(smartContract, "ProfileCreated")
                .withArgs(owner.address, _username, _bio, _avatarHash);
        })
        it("Should revert with ProfileManager.createProfile: username can't be empty", async () => {
            let _username = "";
            let _bio = "bio";
            let _avatarHash = "hash"
            let tx = smartContract.createProfile(_username, _bio, _avatarHash);

            await expect(tx).to.be.revertedWith("ProfileManager.createProfile: username can't be empty");
        })
        it("Should revert with ProfileManager.createProfile: Profile already exists", async () => {
            let _username = "jhjh";
            let _bio = "bio";
            let _avatarHash = "hash"
            await smartContract.createProfile(_username, _bio, _avatarHash);

            let tx = smartContract.createProfile(_username, _bio, _avatarHash);

            await expect(tx).to.be.revertedWith("ProfileManager.createProfile: Profile already exists");
        })
    })

    describe("updateProfile", () => {
        it("Should update and get profile and emit event", async () => {
            let _username = "test";
            let _bio = "bio";
            let _avatarHash = "hash"
            await smartContract.createProfile(_username, _bio, _avatarHash);

            let _usernameUpd = "test2";
            let _bioUpd = "bio2";
            let _avatarHashUpd = "hash2";
            let tx = smartContract.updateProfile(_usernameUpd, _bioUpd, _avatarHashUpd);

            let profile = await smartContract.getProfile(owner.address);
            expect(profile.username).to.be.eq(_usernameUpd);
            expect(profile.bio).to.be.eq(_bioUpd);
            expect(profile.avatarHash).to.be.eq(_avatarHashUpd);
            expect(tx)
                .to.emit(smartContract, "ProfileUpdate")
                .withArgs(owner.address, _username, _bio, _avatarHash);
        })
        it("Should revert with ProfileManager.updateProfile: username can't be empty", async () => {
            let _username = "";
            let _bio = "bio";
            let _avatarHash = "hash"
            smartContract.createProfile(_username, _bio, _avatarHash);

            let tx = smartContract.updateProfile(_username, _bio, _avatarHash);

            await expect(tx).to.be.revertedWith("ProfileManager.updateProfile: username can't be empty");
        })
        it("Should revert with ProfileManager.updateProfile: Profile is not created", async () => {
            let _username = "jhjh";
            let _bio = "bio";
            let _avatarHash = "hash"

            let tx = smartContract.updateProfile(_username, _bio, _avatarHash);

            await expect(tx).to.be.revertedWith("ProfileManager.updateProfile: Profile is not created");
        })
    })

});
