package com.reddy.taskmanager.service;

import com.reddy.taskmanager.entity.Status;
import com.reddy.taskmanager.entity.Task;
import com.reddy.taskmanager.entity.User;
import com.reddy.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    private TaskRepository repo;
    private TaskService service;

    private User user;

    @BeforeEach
    void setup() {
        repo = mock(TaskRepository.class);
        service = new TaskService(repo);

        user = User.builder().id(1L).username("john").build();
    }

    @Test
    void list_shouldReturnTasksForUser() {
        Task task = Task.builder().id(1L).title("Task1").owner(user).build();
        when(repo.findByOwner(user)).thenReturn(List.of(task));

        List<Task> result = service.list(user);

        assertEquals(1, result.size());
        assertEquals("Task1", result.get(0).getTitle());
        verify(repo).findByOwner(user);
    }

    @Test
    void create_shouldSaveTask() {
        Task task = Task.builder().title("New").owner(user).build();
        Task saved = Task.builder().id(99L).title("New").owner(user).build();

        when(repo.save(task)).thenReturn(saved);

        Task result = service.create(task);

        assertNotNull(result.getId());
        assertEquals(99L, result.getId());
        verify(repo).save(task);
    }

    @Test
    void updateOwned_shouldUpdateAndSave() {
        Long id = 5L;
        Task existing = Task.builder()
                .id(id)
                .title("Old")
                .description("desc")
                .status(Status.TODO)
                .dueDate(LocalDate.now())
                .owner(user)
                .build();

        Task updateData = Task.builder()
                .title("Updated")
                .description("newdesc")
                .status(Status.DONE)
                .dueDate(LocalDate.now().plusDays(2))
                .build();

        when(repo.findByIdAndOwner(id, user)).thenReturn(Optional.of(existing));
        when(repo.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = service.updateOwned(id, user, updateData);

        assertEquals("Updated", result.getTitle());
        assertEquals("newdesc", result.getDescription());
        assertEquals(Status.DONE, result.getStatus());

        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(repo).save(captor.capture());
        Task saved = captor.getValue();

        assertEquals("Updated", saved.getTitle());
        assertEquals(Status.DONE, saved.getStatus());
    }

    @Test
    void updateOwned_shouldThrowWhenNotFound() {
        when(repo.findByIdAndOwner(99L, user)).thenReturn(Optional.empty());

        assertThrows(Exception.class,
                () -> service.updateOwned(99L, user, new Task()));
    }

    @Test
    void deleteOwned_shouldDeleteTask() {
        Long id = 10L;
        Task existing = Task.builder().id(id).owner(user).build();

        when(repo.findByIdAndOwner(id, user)).thenReturn(Optional.of(existing));

        service.deleteOwned(id, user);

        verify(repo).delete(existing);
    }

    @Test
    void deleteOwned_shouldThrowWhenNotFound() {
        when(repo.findByIdAndOwner(77L, user)).thenReturn(Optional.empty());

        assertThrows(Exception.class,
                () -> service.deleteOwned(77L, user));
    }
}
