Decentralized Freelance Task Management Platform

Overview

This is a decentralized platform for managing freelance tasks. The platform allows task owners to create tasks, assign them to freelancers, and track task completion. The solution leverages blockchain technology to ensure transparency, security, and efficiency. It also includes a backend for managing business logic and a frontend for user interaction.

Features

Blockchain (Solidity):

Task Creation: Owners can create tasks with a description, budget, and deadline.

Task Assignment: Owners can assign tasks to freelancers.

Task Completion: Freelancers can mark tasks as completed before the deadline.

Data Integrity: All task data is stored on the blockchain, ensuring immutability.

User Registration: Users can register on the platform with a username and bio.

User Verification: Check if a user is registered.

Task Listing: Retrieve all tasks available on the platform.

Frontend (React):

User-friendly interface for task creation and management.

Real-time updates on task statuses using blockchain events.

Form validation for entering task details.

Task filtering and sorting for easy navigation.

User registration and login functionality.

Backend (Spring Boot):

REST API for interacting with the blockchain and managing tasks.

User management: Registration, authentication, and profile management.

Task management: Creating, updating, and retrieving tasks.

Middleware for validating data before sending transactions to the blockchain.

Database integration (optional) for caching frequently accessed data.

Architecture

The platform is divided into three main components:

1. Blockchain

Written in Solidity.

Deployed on Ethereum-compatible testnets (e.g., Goerli or Hardhat local network).

Handles all critical operations, including task creation, assignment, and completion.

2. Backend

Built with Spring Boot.

Provides APIs for interacting with the blockchain.

Validates inputs and ensures proper flow of data.

3. Frontend

Built with React.

Provides a clean and intuitive user interface for interacting with the platform.

Technologies Used

Smart Contracts

Solidity

Hardhat

Backend

Java (Spring Boot)

Web3j for blockchain interaction

Frontend

React

Ethers.js or Web3.js for blockchain interaction

Development Tools

Node.js

Hardhat (for contract deployment and testing)

Metamask (for wallet integration)

Installation

Prerequisites

Node.js and npm

Java and Maven

Metamask Wallet

Hardhat

Steps

Clone the Repository:

git clone https://github.com/your-username/freelance-dapp.git
cd freelance-dapp

Install Dependencies:

For the blockchain project:

cd src/blockchain
npm install

For the backend project:

cd src/backend
mvn install

For the frontend project:

cd src/frontend
npm install

Deploy Smart Contracts:

npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

Start Backend:

cd src/backend
mvn spring-boot:run

Start Frontend:

cd src/frontend
npm start

Check h2 database
http://localhost:8080/h2-console

Usage

Connect Wallet:

Use Metamask to connect your wallet to the platform.

Register as a User:

Provide your username and bio to register on the platform.

Create a Task:

Enter the task details (description, budget, and deadline).

View Tasks:

See the list of available tasks.

Assign Executor:

Assign a task to a freelancer.

Complete Task:

The assigned freelancer marks the task as completed.

Testing

Smart Contract Tests

Navigate to the blockchain directory:

cd src/blockchain
Run tests:

npx hardhat test

Backend and Frontend Tests

Backend:

mvn test

Frontend:

npm test

Run HARDHAT NODE AND DEPLOY CONTRACTS
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

