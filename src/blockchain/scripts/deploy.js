const { ethers } = require("hardhat");


async function main() {
    const userRegistry = await ethers.deployContract("UserRegistry");

    console.log("UserRegistry deployed to:", userRegistry.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});