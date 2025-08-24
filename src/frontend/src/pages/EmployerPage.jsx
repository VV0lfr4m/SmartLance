import { useEffect, useState, useRef } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import * as TaskManagerUtils from "../contracts/utils/TaskManagerUtils";

function EmployerPage() {
    const [tasks, setTasks] = useState([]);
    const isMounted = useRef(false); // ✅ Prevents double execution in React Strict Mode
    const isListenerAdded = useRef(false); // ✅ Prevents duplicate event listeners

    // ✅ Fetch all tasks once on mount
    const fetchTasks = async () => {
        try {
            console.log("📢 Fetching all tasks..."); // ✅ Logs only once
            const response = await TaskManagerUtils.callGetAllTasks();
            setTasks(response);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isMounted.current) return; // ✅ Prevent second execution in Strict Mode
        isMounted.current = true;

        fetchTasks();

        if (!isListenerAdded.current) {
            isListenerAdded.current = true;

            const handleTaskChange = async (event) => {
                let newTask = await TaskManagerUtils.callGetTask(event.taskId);
                console.log("📢 Task updated:", newTask); // ✅ Logs only once per update

                setTasks((prevTasks) =>
                    prevTasks.some(task => task.id === newTask.id)
                        ? prevTasks.map(task => (task.id === newTask.id ? newTask : task))
                        : [...prevTasks, newTask]
                );
            };

            // ✅ Listen for events only ONCE
            TaskManagerUtils.listenTaskCreated(handleTaskChange);
            TaskManagerUtils.listenTaskConfirmed(handleTaskChange);
        }

        return () => {
            TaskManagerUtils.removeAllListeners(); // ✅ Remove listeners on cleanup
        };
    }, []);

    // ✅ Task confirmation without refetching all tasks
    const confirmTask = async (taskId) => {
        try {
            await TaskManagerUtils.callConfirmTaskCompletion(taskId);
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, isConfirmed: true } : task
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const initiateDispute = async (taskId, arbiterAddress) => {
        try {
            await TaskManagerUtils.callInitiateArbitration(taskId, arbiterAddress);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <TaskForm />
            <TaskList tasks={tasks} confirmTask={confirmTask} initiateDispute={initiateDispute} />
        </div>
    );
}

export default EmployerPage;
