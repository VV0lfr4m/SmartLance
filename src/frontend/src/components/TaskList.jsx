import "../styles/TaskList.css";

//todo add input field for arbiter address
function TaskList({tasks, confirmTask, initiateDispute}) {
    return (
        <div className="task-list">
            {tasks.length > 0 ? (
                tasks.map(task => (
                    <div key={task.id} className="task">
                        <p><strong>Description:</strong> {task.description || "N/A"}</p>
                        <p><strong>Budget:</strong> {task.budget ? `${task.budget} ETH` : "N/A"}</p>
                        <p><strong>Deadline:</strong> {task.endDate || "N/A"}</p>
                        <p><strong>Status:</strong> {task.status || "N/A"}</p>
                        <p><strong>Review:</strong> {task.review || "No reviews yet"}</p>
                        <button onClick={() => confirmTask(task.id)}>Confirm task</button>
                        <button onClick={() => initiateDispute(task.id, "0x123")}>Initialize dispute</button>

                    </div>
                ))
            ) : (
                // Placeholder for when no tasks are available
                <div className="task empty-task">
                    <p><strong>Description:</strong> No tasks available</p>
                    <p><strong>Budget:</strong> --</p>
                    <p><strong>Deadline:</strong> --</p>
                    <p><strong>Status:</strong> --</p>
                    <p><strong>Review:</strong> --</p>
                </div>
            )}
        </div>
    );
}

export default TaskList;
