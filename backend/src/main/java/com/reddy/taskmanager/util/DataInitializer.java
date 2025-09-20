package com.reddy.taskmanager.util;

import com.reddy.taskmanager.dto.RegisterRequest;
import com.reddy.taskmanager.entity.Task;
import com.reddy.taskmanager.entity.Status;
import com.reddy.taskmanager.entity.User;
import com.reddy.taskmanager.service.TaskService;
import com.reddy.taskmanager.service.UserService;
import com.reddy.taskmanager.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;


@Component
public class DataInitializer implements CommandLineRunner {

    private final UserService users;
    private final TaskService tasks;
    private final UserRepository userRepo;

    public DataInitializer(UserService users, TaskService tasks, UserRepository userRepo) {
        this.users = users;
        this.tasks = tasks;
        this.userRepo = userRepo;
    }

    @Override
    public void run(String... args) {
        User u = userRepo.findByUsername("demo").orElseGet(() -> users.register(new RegisterRequest("demo", "password")));
        if (tasks.list(u).isEmpty()) {
            tasks.create(Task.builder().title("Learn Spring Security").description("JWT & Filters").status(Status.IN_PROGRESS).dueDate(LocalDate.now().plusDays(3)).owner(u).build());
            tasks.create(Task.builder().title("Build Angular UI").description("Material + Interceptor").status(Status.TODO).dueDate(LocalDate.now().plusDays(5)).owner(u).build());
            tasks.create(Task.builder().title("Learn Java").description("Basics + Oops + Collections").status(Status.DONE).dueDate(LocalDate.now().plusDays(6)).owner(u).build());
        }
    }
}
