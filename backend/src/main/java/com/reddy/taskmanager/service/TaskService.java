package com.reddy.taskmanager.service;

import com.reddy.taskmanager.entity.Task;
import com.reddy.taskmanager.entity.User;
import com.reddy.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class TaskService {
    private final TaskRepository repo;

    public TaskService(TaskRepository repo){
        this.repo=repo;
    }

    public List<Task> list(User owner){
        return repo.findByOwner(owner);
    }
    public Task create(Task t){
        return repo.save(t);
    }

    public Task updateOwned(Long id, User owner, Task data){
        var existing = repo.findByIdAndOwner(id, owner).orElseThrow();
        existing.setTitle(data.getTitle());
        existing.setDescription(data.getDescription());
        existing.setStatus(data.getStatus());
        existing.setDueDate(data.getDueDate());
        return repo.save(existing);
    }

    public void deleteOwned(Long id, User owner){
        var existing = repo.findByIdAndOwner(id, owner).orElseThrow();
        repo.delete(existing);
    }
}
