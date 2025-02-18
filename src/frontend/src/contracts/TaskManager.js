import TaskManagerABI from "../contracts/jsons/TaskManager.json";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xYourSmartContractAddress";

export const getContract = () => {
    let provider, signer;

    if (import.meta.env.VITE_NODE_ENV === "development") {
        // Use Hardhat's default local provider for testing
        provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        signer = provider.getSigner(0); // Use the first Hardhat account
    } else {
        // Use MetaMask when running on production/mainnet
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    }

    return new ethers.Contract(CONTRACT_ADDRESS, TaskManagerABI, signer);
};