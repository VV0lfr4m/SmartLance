import Button from "../components/Button";
import {useState} from "react";
import { getContract } from "../contracts/TaskManager";
import { ethers } from "ethers";
import "../styles/TaskForm.css";


function TaskForm({addTask}) {
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState({description : "", budget: "", endDate: ""})

    const handleChange = (e) => {
        setTask({... task, [e.target.name]: e.target.value})
    };
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!task.description || !task.budget || !task.endDate) {
            alert("Please fill all the fields");
            return;
        }
        const contract = await getContract();
        const date = Math.floor(new Date(task.endDate).getTime() / 1000);
        try {
            setLoading(true);
            const transaction = await contract.createTask(task.description, task.budget, date, {value: ethers.parseEther(task.budget)});
            await transaction.wait();
            console.log(transaction);
            await contract.once("TaskCreated", (taskId, owner, description, budget, endDate) => {
                console.log(`✅ Event detected: TaskCreated`);
                console.log(`Task ID: ${taskId}`);
                console.log(`Description: ${description}`);
                console.log(`Budget: ${ethers.formatEther(budget)} ETH`);
                console.log(`End Date: ${new Date(endDate * 1000).toLocaleString()}`);
                console.log(`Owner: ${owner}`);
            });
            //addTask(task);
            setTask({description : "", budget: "", endDate: ""});
            alert("Task is created!");
        }catch (err) {
            console.error("Transaction failed:", error);
            alert("Transaction failed ❌");
        }finally {
            setLoading(false);
        }
    };

    return (
            <form onSubmit={handleSubmit} className="create-task-form">
                <label htmlFor ="descr"></label>
                <input type="text" name = "description" placeholder="Description" value={task.description} onChange={handleChange} required/>
                <label htmlFor ="budget"></label>
                <input type="number" name = "budget" placeholder="Budget (ETH)" value={task.budget} onChange={handleChange} required/>
                <label htmlFor ="endDate"></label>
                <input type="text" name = "endDate" placeholder="Deadline" value={task.endDate} onChange={handleChange} required/>
                <Button text={loading ? "Publishing..." : "Publish the task"} disabled={loading} className={`submit-button ${loading ? "disabled" : ""}`}/>
            </form>
    );
}

export default TaskForm;
