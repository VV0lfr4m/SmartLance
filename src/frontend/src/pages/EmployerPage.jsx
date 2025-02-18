import Button from "../components/Button";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {useEffect, useState} from "react";

function EmployerPage() {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        //fetchTasks()
    }, [])
    const fetchTasks = async () => {
        try {
            const response = await fetch("");
            const jsonData = response.json();
            setTasks(jsonData);
        }catch (err) {
            console.error(err);
        }
    }
    //const confirmTask
    //const initDispute
    return (
        <div>
            <TaskForm/>
            <TaskList tasks={tasks} /> {/*will show the active or completed tasks*/}
            {console.log(import.meta.env.VITE_NODE_ENV)}
        </div>
    );
}

export default EmployerPage;
