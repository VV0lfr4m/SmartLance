// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./TaskManager.sol";
import "./ArbitrationManager.sol";

contract DeployFactory {
    address public taskManager;
    address public arbitrationManager;
    address public owner;

    bool public initialized;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyNotInitialized() {
        require(!initialized, "Already initialized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function deployContracts() external onlyOwner onlyNotInitialized {
        // Деплой TaskManager і ArbitrationManager з `DeployFactory` як власником
        TaskManager taskManagerContract = new TaskManager(address(this));
        taskManager = address(taskManagerContract);

        ArbitrationManager arbitrationManagerContract = new ArbitrationManager(address(this));
        arbitrationManager = address(arbitrationManagerContract);

        // Зв'язок контрактів
        taskManagerContract.setArbitrationManager(arbitrationManager);
        arbitrationManagerContract.setTaskManager(taskManager);

        initialized = true;
    }
}