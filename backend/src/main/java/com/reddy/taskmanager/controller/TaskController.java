package com.reddy.taskmanager.controller;

import com.reddy.taskmanager.entity.Task;
import com.reddy.taskmanager.entity.Status;
import com.reddy.taskmanager.entity.User;
import com.reddy.taskmanager.service.TaskService;
import com.reddy.taskmanager.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService tasks;

    private final UserService users;

    public TaskController(TaskService tasks, UserService users) {
        this.tasks = tasks;
        this.users = users;
    }

    private User currentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return users.findByUsername(username);
    }

    @GetMapping
    public List<Task> myTasks() {
        return tasks.list(currentUser());
    }

    @PostMapping
    public Task create(@RequestBody Task req) {
        req.setId(null);
        req.setOwner(currentUser());
        if (req.getStatus() == null) req.setStatus(Status.TODO);
        if (req.getDueDate() == null) req.setDueDate(LocalDate.now().plusDays(7));
        return tasks.create(req);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task req) {
        return tasks.updateOwned(id, currentUser(), req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        tasks.deleteOwned(id, currentUser());
    }
}
