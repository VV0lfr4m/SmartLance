# 🛠️ Decentralized Freelance Task Management Platform

## 📘 Overview

This is a decentralized platform for managing freelance tasks. The platform allows task owners to create tasks, assign them to freelancers, and track task completion. The solution leverages **blockchain technology** to ensure **transparency**, **security**, and **efficiency**. It includes:

- Smart contracts on Ethereum-compatible networks
- A backend built with Spring Boot
- A frontend built with React

---

## 🚀 Features

### 🔗 Blockchain (Solidity)
- **Task Creation**: Owners can create tasks with a description, budget, and deadline.
- **Task Assignment**: Owners can assign tasks to freelancers.
- **Task Completion**: Freelancers can mark tasks as completed before the deadline.
- **Data Integrity**: All task data is stored on-chain for immutability.
- **User Registration**: Users can register with a username and bio.
- **User Verification**: Check if a user is registered.
- **Task Listing**: Retrieve all tasks available on the platform.

### 🖥️ Frontend (React)
- User-friendly interface for task creation and management
- Real-time updates using blockchain events
- Form validation for task data
- Task filtering and sorting
- User registration and login

### 🧩 Backend (Spring Boot)
- REST API to interact with blockchain and manage tasks
- User management: registration, authentication, profiles
- Task CRUD: create, update, retrieve tasks
- Middleware to validate data before transactions
- Optional database for caching frequently used data

---

## 🏗️ Architecture

The platform consists of three components:

### 1. Blockchain
- Written in **Solidity**
- Deployed on **Ethereum-compatible testnets** (e.g., Goerli, Hardhat local)
- Manages task lifecycle: create → assign → complete

### 2. Backend
- Built with **Spring Boot**
- Serves as the bridge between frontend and smart contracts
- Validates and orchestrates data flow

### 3. Frontend
- Built with **React**
- Offers a clean, intuitive interface for users

---

## 🛠️ Technologies Used

### 🔒 Smart Contracts
- Solidity
- Hardhat

### 🧠 Backend
- Java (Spring Boot)
- Web3j

### 🌐 Frontend
- React
- Ethers.js or Web3.js

### 🔧 Development Tools
- Node.js
- Hardhat
- Metamask

---

## ⚙️ Installation

### 🔑 Prerequisites
- Node.js and npm
- Java and Maven
- Metamask Wallet
- Hardhat

### 📥 Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/freelance-dapp.git
   cd freelance-dapp
2. **Install Dependencies**
  Blockchain:
    cd src/blockchain
    npm install
  Backend:
    cd src/backend
    mvn install
  Frontend:
    cd src/frontend
    npm install
3. **Deploy Smart Contracts**
    npx hardhat compile
    npx hardhat node
    npx hardhat run scripts/deploy.js --network localhost

4. **Start Backend**
   mvn spring-boot:run

5. **Start Frontend**   
   npm run dev
   
6. **Check h2 database**
   http://localhost:8080/h2-console

## 🧪 Usage
1. Connect Wallet
Use Metamask to connect your wallet to the platform.

2. Register as a User
Provide your username and bio.

3. Create a Task
Fill in:
Description
Budget
Deadline

4. View Tasks
Browse the list of available tasks.

5. Assign Executor
Assign a task to a freelancer.

6. Complete Task
Freelancer marks the task as completed.
   
