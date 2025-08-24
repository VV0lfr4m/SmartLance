import Button from "../components/Button";
import {useState} from "react";
import "../styles/TaskForm.css";
import * as TaskManagerUtils from "../contracts/utils/TaskManagerUtils";


function TaskForm() {
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState({
        id: "",
        owner: "",
        description: "",
        budget: "",
        endDate: "",
        executor: "",
        isCompleted: false,
        isConfirmed: false,
        isInArbitration: false
    });

    const handleChange = (e) => {
        setTask({... task, [e.target.name]: e.target.value})
    };
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!task.description || !task.budget || !task.endDate) {
            alert("Please fill all the fields");
            return;
        }
        try {
            setLoading(true);
            const transaction = await TaskManagerUtils.callCreateTask(task);
            console.log(transaction);
            setTask({
                id: "",
                owner: "",
                description: "",
                budget: "",
                endDate: "",
                executor: "",
                isCompleted: false,
                isConfirmed: false,
                isInArbitration: false
            });
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
                <input type="text" name = "endDate" placeholder="Deadline (dd-mm-yyyy)" value={task.endDate} onChange={handleChange} required/>
                <Button text={loading ? "Publishing..." : "Publish the task"} disabled={loading} className={`submit-button ${loading ? "disabled" : ""}`}/>
            </form>
    );
}

export default TaskForm;
