import {getContract} from "../TaskManager";
import {ethers} from "ethers";

/**
 * Creates a new task on the blockchain
 * @param {Object} task - The task object containing description, budget, and end date
 * @returns {Promise<Object>} - Transaction details
 */
export async function callCreateTask(task) {
    try {
        const contract = await getContract();
        const date = Math.floor(new Date(task.endDate).getTime() / 1000);
        const transaction = await contract.createTask(task.description, task.budget, date, {
            value: ethers.parseEther(task.budget)
        });
        await transaction.wait();
        return transaction;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
}

/**
 * Assigns an executor to a task
 * @param {number} taskId - Task ID
 * @param {string} executorAddress - Address of the assigned freelancer
 * @returns {Promise<Object>} - Transaction details
 */
export async function callAssignExecutor(taskId, executorAddress) {
    try {
        const contract = await getContract();
        const transaction = await contract.assignExecutor(taskId, executorAddress);
        await transaction.wait();
        return transaction;
    } catch (error) {
        console.error("Error assigning executor:", error);
        throw error;
    }
}

/**
 * Retrieves a single task details
 * @param {number} taskId - Task ID
 * @returns {Promise<Object>} - Formatted task details
 */
export async function callGetTask(taskId) {
    try {
        const contract = await getContract();
        const taskData = await contract.getTask(taskId);
        return {
            id: index,
            owner: taskData[0],
            description: taskData[1],
            budget: ethers.formatEther(taskData[2]),
            endDate: new Date(taskData[3] * 1000).toLocaleString(),
            executor: taskData[4],
            isCompleted: taskData[5],
            isConfirmed: taskData[6],
            isInArbitration: taskData[7],
        };
    } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
    }
}

/**
 * Retrieves all tasks from the blockchain
 * @returns {Promise<Array>} - List of formatted tasks
 */
export async function callGetAllTasks() {
    try {
        const contract = await getContract();
        const tasksData = await contract.getAllTasks();
        return tasksData.map((task, index) => ({
            id: index,
            owner: task[0],
            description: task[1],
            budget: ethers.formatEther(task[2]),
            endDate: new Date(task[3] * 1000).toLocaleString(),
            executor: task[4],
            isCompleted: task[5],
            isConfirmed: task[6],
            isInArbitration: task[7],
        }));
    } catch (error) {
        console.error("Error fetching all tasks:", error);
        throw error;
    }
}

/**
 * Confirms task completion on the blockchain
 * @param {number} taskId - Task ID
 * @returns {Promise<void>}
 */
export async function callConfirmTaskCompletion(taskId) {
    try {
        const contract = await getContract();
        const tx = await contract.confirmTaskCompletion(taskId);
        await tx.wait();
    } catch (error) {
        console.error("Error confirming task completion:", error);
        throw error;
    }
}

/**
 * Confirms task completion on the blockchain
 * @param {number} taskId - Task ID
 * @param {string} arbiterAddress - arbiter Address
 * @returns {Promise<Object>} - Transaction details
 */
export async function callInitiateArbitration(taskId, arbiterAddress) {
    try {
        const contract = await getContract();
        const tx = await contract.initiateArbitration(taskId, arbiterAddress);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error("Error init arbitration:", error);
        throw error;
    }
}

/**
 * Listen for "TaskCreated" event
 */
export const listenTaskCreated = async (callback) => {
    const contract = getContract();
    contract.on("TaskCreated", (taskId, owner, description, budget, endDate) => {
        const eventObject = {
            eventType: "TaskCreated",
            taskId: Number(taskId),
            owner,
            description,
            budget: ethers.formatEther(budget),
            endDate: new Date(Number(endDate) * 1000).toLocaleString(),
        };
        console.log("✅ Event detected:", eventObject);
        if (callback) callback(eventObject);
    });
};

/**
 * Listen for "TaskAssigned" event
 */
export const listenTaskAssigned = async (callback) => {
    const contract = getContract();
    contract.on("TaskAssigned", (taskId, executor) => {
        const eventObject = {
            eventType: "TaskAssigned",
            taskId: Number(taskId),
            executor,
        };
        console.log("✅ Event detected:", eventObject);
        if (callback) callback(eventObject);
    });
};

/**
 * Listen for "TaskCompleted" event
 */
export const listenTaskCompleted = async (callback) => {
    const contract = getContract();
    contract.on("TaskCompleted", (taskId) => {
        const eventObject = {
            eventType: "TaskCompleted",
            taskId: Number(taskId),
        };
        console.log("✅ Event detected:", eventObject);
        if (callback) callback(eventObject);
    });
};

/**
 * Listen for "TaskConfirmed" event
 */
export const listenTaskConfirmed = async (callback) => {
    const contract = getContract();
    contract.on("TaskConfirmed", (taskId, owner) => {
        const eventObject = {
            eventType: "TaskConfirmed",
            taskId: Number(taskId),
            confirmedBy: owner,
        };
        console.log("✅ Event detected:", eventObject);
        if (callback) callback(eventObject);
    });
};

/**
 * Listen for "ArbitrationInitiated" event
 */
export const listenArbitrationInitiated = async (callback) => {
    const contract = getContract();
    contract.on("ArbitrationInitiated", (taskId, arbiter) => {
        const eventObject = {
            eventType: "ArbitrationInitiated",
            taskId: Number(taskId),
            arbiter,
        };
        console.log("✅ Event detected:", eventObject);
        if (callback) callback(eventObject);
    });
};

/**
 * Function to remove all event listeners when needed
 */
export const removeAllListeners = async () => {
    const contract = getContract();
    contract.removeAllListeners();
    console.log("🚫 All event listeners removed.");
};
