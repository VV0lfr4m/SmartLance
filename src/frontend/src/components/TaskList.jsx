import Button from "../components/Button";
import {useState} from "react";

function TaskList({tasks, confirmTask, initiateDispute}) {

    return (
        <div className="task-list">
            {
                tasks.map(task => (
                    <div key={task.id} className="task">
                        <p>Description: {task.description}</p>
                        <p>Budget: {task.budget} ETH</p>
                        <p>Deadline: {task.endDate}</p>
                        <p>Status: {task.status}</p>
                        <p>Review:{task.review}</p>
                        {task.status === "Wait for freelancer" && (
                            <button onClick={() => confirmTask(task.id)}>Confirm task</button>
                        )}
                        {task.status === "On review" && (
                            <button onClick={() => initiateDispute(task.id)}>Initialize dispute</button>
                        )}
                    </div>
                ))
            }
        </div>
    );
}

export default TaskList;
