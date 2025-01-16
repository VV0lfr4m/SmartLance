// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ArbitrationManager.sol";

contract TaskManager {


    struct Task {
        address owner;
        address executor;
        string description;
        uint budget;
        uint endDate;
        bool isCompleted;
        bool isConfirmed;
        bool isInArbitration;
    }

    event TaskCreated(
        uint256 taskId,
        address indexed owner,
        string description,
        uint256 budget,
        uint256 endDate
    );
    event TaskAssigned(uint indexed taskId, address indexed executor);
    event TaskCompleted(uint indexed taskId);
    event TaskConfirmed(uint indexed taskId, address indexed owner);

    mapping(uint => Task) private tasks;
    uint private taskCount;
    address private arbitrationManager;

    constructor() {
    }

    modifier existingTask(uint _taskId) {
        require(_taskId > 0 && _taskId <= taskCount, "TaskManager.existingTask: Task does not exist");
        _;
    }

    function createTask(string calldata _description, uint _budget, uint _endDate) external payable {
        require(bytes(_description).length > 0, "TaskManager.createTask: description should not be empty!");
        require(_budget > 0, "TaskManager.createTask: budget should be greater then 0!");
        require(_endDate > block.timestamp, "TaskManager.createTask: endDate must be in the future!");
        require(msg.value >= _budget, "TaskManager.createTask: Insufficient funds sent!");

        taskCount++;

        tasks[taskCount] = Task({
        owner : msg.sender,
        description : _description,
        budget : _budget,
        endDate : _endDate,
        isCompleted : false,
        isConfirmed : false,
        executor : address(0),
        isInArbitration : false
        });

        emit TaskCreated(taskCount, msg.sender, _description, _budget, _endDate);
    }

    function assignExecutor(uint _taskId, address _executor) external existingTask(_taskId) {
        Task storage task = tasks[_taskId];

        require(task.owner == msg.sender, "TaskManager.assignExecutor: Only owner can perform this operation!");
        require(_executor != address(0), "TaskManager.assignExecutor: Invalid executor address!");
        require(task.executor == address(0), "TaskManager.assignExecutor: Executor already assigned!");

        task.executor = _executor;

        emit TaskAssigned(_taskId, _executor);
    }

    function completeTask(uint _taskId) external existingTask(_taskId) {
        Task storage task = tasks[_taskId];
        require(task.executor == msg.sender, "TaskManager.completeTask: Only executor can complete the task!");
        require(!task.isCompleted, "TaskManager.completeTask: Task already completed!");
        require(block.timestamp <= task.endDate, "TaskManager.completeTask: Deadline has passed!");

        task.isCompleted = true;

        emit TaskCompleted(_taskId);
    }

    function getTask(uint _taskId) public view existingTask(_taskId) returns (address owner, string memory description,
        uint256 budget, uint256 endDate, address executor, bool isCompleted, bool isConfirmed, bool isInArbitration) {

        Task memory task = tasks[_taskId];

        return (
        task.owner,
        task.description,
        task.budget,
        task.endDate,
        task.executor,
        task.isCompleted,
        task.isConfirmed,
        task.isInArbitration
        );
    }

    function getAllTasks() public view returns (Task[] memory) {
        Task[] memory taskArray = new Task[](taskCount);

        for (uint i = 1; i <= taskCount; i++) {
            taskArray[i - 1] = tasks[i];
        }

        return taskArray;
    }


    function acceptTask(uint _taskId) external existingTask(_taskId) {
        Task storage task = tasks[_taskId];

        require(task.executor == address(0), "TaskManager.acceptTask: Task already accepted");
        require(msg.sender != task.owner, "TaskManager.acceptTask: Task owner cannot accept their own task");

        // Призначення виконавця
        task.executor = msg.sender;

        emit TaskAssigned(_taskId, msg.sender);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function confirmTaskCompletion(uint _taskId) external payable existingTask(_taskId) {
        Task storage task = tasks[_taskId];

        require(msg.sender == task.owner, "TaskManager.confirmTaskCompletion: You are not an owner");
        require(task.isCompleted, "TaskManager.confirmTaskCompletion: Task is not completed");
        require(!task.isInArbitration, "TaskManager: Task is under arbitration");

        task.isConfirmed = true;

        // Переводимо кошти виконавцю
        payable(task.executor).transfer(task.budget);

        emit TaskConfirmed(_taskId, msg.sender);
    }


    function initiateArbitration(uint _taskId, address _arbiter) external existingTask(_taskId) {
        Task storage task = tasks[_taskId];
        require(
            msg.sender == task.owner || msg.sender == task.executor,
            "TaskManager: Only owner or executor can initiate arbitration"
        );
        require(!task.isInArbitration, "TaskManager: Task already in arbitration");

        arbitrationManager = _arbiter;
        (bool success,) = address(_arbiter).call{value : task.budget}(
            abi.encodeWithSignature(
                "initializeArbitration(uint256,address,address,uint256,address)",
                _taskId,
                task.owner,
                task.executor,
                task.budget,
                _arbiter
            )
        );

        require(success, "TaskManager: Failed to initiate arbitration");

        task.isInArbitration = true;
    }


    modifier onlyArbitrationManager() {
        require(msg.sender == arbitrationManager, "TaskManager.onlyArbitrationManager: Only ArbitrationManager can call this function");
        _;
    }

    //this function is listening Arbitration events of resolving or finalization
    function completeArbitration(uint _taskId) external onlyArbitrationManager {
        Task storage task = tasks[_taskId];
        require(task.isInArbitration, "TaskManager: Task is not in arbitration");

        task.isInArbitration = false;
        arbitrationManager = address(0);

    }


}
