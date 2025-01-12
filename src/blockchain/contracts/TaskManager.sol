// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract TaskManager {
    constructor(){

    }

    struct Task {
        address owner;
        address executor;
        string description;
        uint budget;
        uint endDate;
        bool isCompleted;
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

    mapping(uint => Task) private tasks;
    uint private taskCount;

    function createTask(string calldata _description, uint _budget, uint _endDate) external {
        require(bytes(_description).length > 0, "TaskManager.createTask: description should not be empty!");
        require(_budget > 0, "TaskManager.createTask: budget should be greater then 0!");
        require(_endDate > block.timestamp, "TaskManager.createTask: endDate must be in the future!");

        taskCount++;

        tasks[taskCount] = Task({
        owner : msg.sender,
        description : _description,
        budget : _budget,
        endDate : _endDate,
        isCompleted : false,
        executor : address(0)
        });

        emit TaskCreated(taskCount, msg.sender, _description, _budget, _endDate);
    }

    function assignExecutor(uint _taskId, address _executor) external {
        Task storage task = tasks[_taskId];

        require(task.owner == msg.sender, "TaskManager.assignExecutor: Only owner can perform this operation!");
        require(_executor != address(0), "TaskManager.assignExecutor: Invalid executor address!");
        require(task.executor == address(0), "TaskManager.assignExecutor: Executor already assigned!");

        task.executor = _executor;

        emit TaskAssigned(_taskId, _executor);
    }

    function completeTask(uint _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.executor == msg.sender, "TaskManager.completeTask: Only executor can complete the task!");
        require(!task.isCompleted, "TaskManager.completeTask: Task already completed!");
        require(block.timestamp <= task.endDate, "TaskManager.completeTask: Deadline has passed!");

        task.isCompleted= true;

        emit TaskCompleted(_taskId);
    }

    function getTask(uint _taskId) public view returns (address owner, string memory description,
        uint256 budget, uint256 endDate, address executor, bool isCompleted) {

        Task memory task = tasks[_taskId];

        return (
        task.owner,
        task.description,
        task.budget,
        task.endDate,
        task.executor,
        task.isCompleted
        );
    }

    function getAllTasks() public view returns (Task[] memory) {
        Task[] memory taskArray = new Task[](taskCount);

        for (uint i = 1; i <= taskCount; i++) {
            taskArray[i - 1] = tasks[i];
        }

        return taskArray;
    }
}
