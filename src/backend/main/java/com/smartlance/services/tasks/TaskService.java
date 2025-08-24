package com.smartlance.services.tasks;

import com.smartlance.models.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService implements ITaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task) {
        //Mock non null params
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findByIsCompletedFalse();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task assignExecutor(Long id, String executorAddress) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setExecutorAddress(executorAddress);
        return taskRepository.save(task);
    }

    public Task completeTask(Long id) {
        //todo check for executor
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setCompleted(true);
        return taskRepository.save(task);
    }
}