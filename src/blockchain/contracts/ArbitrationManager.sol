// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ArbitrationManager {
    constructor() payable{

    }
    struct Arbitration {
        uint taskId;
        address owner;
        address executor;
        address arbiter;
        uint budget;
        bool resolved;
        address winner;

    }

    mapping(uint => Arbitration) private arbitrations;
    uint public arbCount;

    event ArbitrationInitiated(uint indexed arbitrationId, uint indexed taskId, address indexed arbiter);
    event ArbitrationResolved(uint indexed arbitrationId, address indexed winner, uint amount);

    modifier onlyParticipant(uint _taskId) {
        Arbitration memory arbitration = arbitrations[_taskId];
        require(msg.sender == arbitration.owner || msg.sender == arbitration.executor, "ArbitrationManager.onlyParticipant: Only task owner or executor can perform this action");
        _;
    }

    modifier onlyArbiter(uint _taskId) {
        Arbitration memory arbitration = arbitrations[_taskId];
        require(msg.sender == arbitration.arbiter, "ArbitrationManager.onlyArbiter: Only arbiter can proceed");
        _;
    }

    function initializeArbitration(uint _taskId, address _owner, address _executor, uint _budget, address _arbiter) external  {
        Arbitration storage arb = arbitrations[_taskId];
        require(msg.sender == _owner || msg.sender == _executor, "ArbitrationManager.initializeArbitration: Only participants can initiate arbitration");
        require(arb.taskId == 0, "ArbitrationManager.initializeArbitration: Arbitration already exists");
        require(_arbiter != address(0), "ArbitrationManager.initializeArbitration: Invalid arbiter address");

        arb.taskId = _taskId;
        arb.owner = _owner;
        arb.executor = _executor;
        arb.arbiter = _arbiter;
        arb.budget = _budget;
        arb.resolved = false;
        arb.winner = address(0);

        arbCount++;
        emit ArbitrationInitiated(arbCount, _taskId, _arbiter);
    }

    function resolveArbitration(uint _taskId, address _winner) external payable onlyArbiter(_taskId) {
        Arbitration storage arb = arbitrations[_taskId];
        require(arb.taskId != 0, "ArbitrationManager.resolveArbitration: Arbitration does not exist");
        require(!arb.resolved, "ArbitrationManager.resolveArbitration: Arbitration already resolved");
        require(_winner == arb.winner || _winner == arb.executor, "ArbitrationManager.resolveArbitration: Winner must be owner or executor");
        arb.winner = _winner;
        arb.resolved = true;

        // Передача коштів переможцю
        //todo create correct communication between managers
        payable(_winner).transfer(arb.budget);

        emit ArbitrationResolved(_taskId, _winner, arb.budget);
    }

    function getArbitration(uint _taskId) external view returns (
        uint taskId,
        address owner,
        address executor,
        address arbiter,
        uint budget,
        bool resolved,
        address winner)
    {
        Arbitration storage arbitration = arbitrations[_taskId];
        require(arbitration.taskId != 0, "ArbitrationManager.getArbitration: Arbitration does not exist");

        return (
        arbitration.taskId,
        arbitration.owner,
        arbitration.executor,
        arbitration.arbiter,
        arbitration.budget,
        arbitration.resolved,
        arbitration.winner
        );
    }

    function isInArbitration(uint _taskId) public view returns (bool) {
        return arbitrations[_taskId].taskId != 0 && !arbitrations[_taskId].resolved;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    receive() external payable {}
}
