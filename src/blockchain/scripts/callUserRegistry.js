const { ethers } = require("ethers");
require("dotenv").config();

// Load contract ABI
const contractABI = require("../artifacts/contracts/UserRegistry.sol/UserRegistry.json").abi;

// Replace with the deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with actual address

// Load provider and wallet
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Local Hardhat node
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Replace with a funded account's private key from Hardhat
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

async function main() {
    const action = process.argv[2]; // Get action (register / getInfo)

    if (action === "register") {
        const username = process.argv[3];
        const bio = process.argv[4];

        if (!username || !bio) {
            console.log("Usage: node scripts/callUserRegistry.js register <username> <bio>");
            return;
        }

        console.log(`Registering user: ${username}...`);
        const tx = await contract.registerUser(username, bio);
        await tx.wait();
        console.log(`User '${username}' registered successfully!`);
    } else if (action === "getInfo") {
        console.log("Fetching user info...");
        const userInfo = await contract.getUserInfo(wallet.address);
        console.log(`Username: ${userInfo[0]}`);
        console.log(`Bio: ${userInfo[1]}`);
    } else {
        console.log("Invalid action. Use 'register' or 'getInfo'.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//node scripts/callUserRegistry.js getInfo
//node scripts/callUserRegistry.js register "Alice" "Blockchain Developer"