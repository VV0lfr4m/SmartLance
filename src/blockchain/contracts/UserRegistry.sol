// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract UserRegistry {

    event UserRegistered(address indexed _userAddress, string username);

    struct User {
        string username;
        string bio;
        bool isRegistered;
    }

    mapping(address => User) private users;

    modifier onlyRegisteredUser(address _user) {
        require(users[_user].isRegistered, "getUserInfo(): User is not registered!");
        _;
    }


    function registerUser(string calldata _username, string calldata _bio) external {
        require(!users[msg.sender].isRegistered, "registerUser(): User already registered!");
        require(bytes(_username).length > 0, "registerUser(): username can't be empty");

        users[msg.sender] = User ({
        username : _username,
        bio : _bio,
        isRegistered : true
        });

        emit UserRegistered(msg.sender, _username);
    }

    function isUserRegistered(address _user) external view returns (bool) {
        return users[_user].isRegistered;
    }

    function getUserInfo(address _userAddress) public view onlyRegisteredUser(_userAddress) returns (string memory, string memory) {
        return (users[_userAddress].username, users[_userAddress].bio);
    }
}
