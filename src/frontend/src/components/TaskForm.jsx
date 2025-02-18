import Button from "../components/Button";
import {useState} from "react";
import { getContract } from "../contracts/TaskManager";
import { ethers } from "ethers";
import "../styles/TaskForm.css";
import bstStyles from '../styles/Button.module.css';


function TaskForm({addTask}) {

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
        const contract = getContract();
        const date = Math.floor(new Date(task.endDate).getTime() / 1000);
        const transaction = await contract.createTask(task.description, task.budget, date, {value: ethers.utils.parseEther(task.budget)});
        await transaction.wait();
        console.log(transaction);
        addTask(task);
        setTask({description : "", budget: "", endDate: ""});
    };

    return (
            <form onSubmit={handleSubmit} className="create-task-form">
                <label htmlFor ="descr"></label>
                <input type="text" name = "description" placeholder="Description" onChange={handleChange} required/>
                <label htmlFor ="budget"></label>
                <input type="number" name = "budget" placeholder="Budget (ETH)" onChange={handleChange} required/>
                <label htmlFor ="endDate"></label>
                <input type="text" name = "endDate" placeholder="Deadline" onChange={handleChange} required/>
                <Button text="Publish the task" className={bstStyles}/>
            </form>
    );
}

export default TaskForm;
