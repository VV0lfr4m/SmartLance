package com.smartlance.services.tasks;

import com.smartlance.models.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task;

    @BeforeEach
    void setUp() {
        task = new Task();
        task.setId(1L);
        task.setDescription("Test task");
        task.setCompleted(false);
    }

    @Test
    void testCreateTask() {
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        Task createdTask = taskService.createTask(task);
        assertNotNull(createdTask);
        assertEquals("Test task", createdTask.getDescription());
    }

    @Test
    void testGetAllTasks() {
        when(taskRepository.findByIsCompletedFalse()).thenReturn(List.of(task));
        List<Task> tasks = taskService.getAllTasks();
        assertEquals(1, tasks.size());
    }

    @Test
    void testGetTaskById() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        Optional<Task> foundTask = taskService.getTaskById(1L);
        assertTrue(foundTask.isPresent());
        assertEquals("Test task", foundTask.get().getDescription());
    }

    @Test
    void testAssignExecutor() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        Task updatedTask = taskService.assignExecutor(1L, "0xExecutorAddress");
        assertEquals("0xExecutorAddress", updatedTask.getExecutorAddress());
    }

    @Test
    void testCompleteTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        Task completedTask = taskService.completeTask(1L);
        assertTrue(completedTask.isCompleted());
    }
}
