import Button from "../components/Button";
import {useState} from "react";

const CompletedTasks = ({ tasks }) => {
    return (
        <div className="completed-tasks">
            <h3>Виконані завдання</h3>
            {tasks.length === 0 ? (
                <p>Немає завершених завдань</p>
            ) : (
                tasks.map(task => (
                    <div key={task.id} className={styles.task}>
                        <p><strong>Description:</strong> {task.description}</p>
                        <p><strong>Budget:</strong> {task.budget} ETH</p>
                        <p><strong>Deadline:</strong> {task.deadline}</p>
                        <p><strong>Review:</strong> {task.review || "Wait for rating"}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default CompletedTasks;
