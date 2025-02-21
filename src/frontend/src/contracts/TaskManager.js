import TaskManagerABI from "../contracts/jsons/TaskManager.json";
import {ethers} from "ethers";

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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