// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ProfileManager {
    struct Profile {
        string username;
        string bio;
        string avatarHash;
    }

    event ProfileCreated(address indexed creator, string username, string bio, string avatarHash);
    event ProfileUpdate(address indexed creator, string username, string bio, string avatarHash);

    mapping(address => Profile) private profiles;

    function createProfile(string calldata _username, string calldata _bio, string calldata _avatarHash) external {
        require(bytes(_username).length > 0, "ProfileManager.createProfile: username can't be empty");
        require(bytes(profiles[msg.sender].username).length == 0, "ProfileManager.createProfile: Profile already exists");

        profiles[msg.sender] = Profile({
        username : _username,
        bio : _bio,
        avatarHash : _avatarHash
        });

        emit ProfileCreated(msg.sender, _username, _bio, _avatarHash);
    }

    function updateProfile(string calldata _username, string calldata _bio, string calldata _avatarHash) external {
        require(bytes(_username).length > 0, "ProfileManager.updateProfile: username can't be empty");
        require(bytes(profiles[msg.sender].username).length > 0, "ProfileManager.updateProfile: Profile is not created");
        Profile storage profile = profiles[msg.sender];
        profile.username = _username;
        profile.bio = _bio;
        profile.avatarHash = _avatarHash;

        emit ProfileUpdate(msg.sender, _username, _bio, _avatarHash);
    }

    function getProfile(address _user) external view returns (
        string memory username,
        string memory bio,
        string memory avatarHash){

        require(_user != address(0), "ProfileManager.getProfile: Invalid user");
        return (
        profiles[msg.sender].username,
        profiles[msg.sender].bio,
        profiles[msg.sender].avatarHash
        );
    }
}
