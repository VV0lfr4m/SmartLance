import Button from "../components/Button";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {useEffect, useState} from "react";
import * as TaskManagerUtils from "../contracts/utils/TaskManagerUtils";

function EmployerPage() {
    const [tasks, setTasks] = useState([]);
    useEffect( () => {
        fetchTasks();

        const handleTaskChange = async (event) => {
            let newTask = await TaskManagerUtils.callGetTask(event.taskId);
            setTasks((prevTasks) =>
                prevTasks.some(task => task.id === newTask.id)
                    ? prevTasks.map(task => (task.id === newTask.id ? newTask : task))
                    : [...prevTasks, newTask]
            );
        }

        TaskManagerUtils.listenTaskCreated(handleTaskChange);

        TaskManagerUtils.listenTaskConfirmed(handleTaskChange);

        return () => TaskManagerUtils.removeAllListeners();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await TaskManagerUtils.callGetAllTasks();
            setTasks([]);
            setTasks(response);
        }catch (err) {
            console.error(err);
        }
    }
    const confirmTask = async (taskId) => {
        try {
            await TaskManagerUtils.callConfirmTaskCompletion(taskId);
        } catch (err) {
            console.error(err);
        }
    }
    const initiateDispute = async (taskId, arbiterAddress) => {
        try {
            await TaskManagerUtils.callInitiateArbitration(taskId, arbiterAddress);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <TaskForm/>
            <TaskList tasks={tasks} confirmTask={confirmTask} initiateDispute={initiateDispute} /> {/*will show the active or completed tasks*/}
            {console.log(import.meta.env.VITE_NODE_ENV)}
        </div>
    );
}

export default EmployerPage;
