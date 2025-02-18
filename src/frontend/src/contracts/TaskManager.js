import TaskManagerABI from "../contracts/jsons/TaskManager.json";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const getContract = async() => {
    let provider, signer;

    if (import.meta.env.VITE_NODE_ENV === "development") {
        // Use Hardhat's default local provider for testing
        provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        signer = await provider.getSigner();// Use the first Hardhat account
    } else {
        // Use MetaMask when running on production/mainnet
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = provider.getSigner();
    }

    return new ethers.Contract(CONTRACT_ADDRESS, TaskManagerABI, signer);
};