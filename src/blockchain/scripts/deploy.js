const { ethers } = require("hardhat");


async function main() {
    const userRegistry = await ethers.deployContract("UserRegistry");
    const taskManager = await ethers.deployContract("TaskManager", ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]);

    console.log("UserRegistry deployed to:", userRegistry.address);
    console.log("TaskManager deployed to:", taskManager.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});