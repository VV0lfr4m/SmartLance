package com.smartlance.services.tasks;

import com.smartlance.models.Task;

import java.util.List;
import java.util.Optional;

public interface ITaskService {
    Task createTask(Task task);
    List<Task> getAllTasks();
    Optional<Task> getTaskById(Long id);
    Task assignExecutor(Long id, String executorAddress);
    Task completeTask(Long id);
}
