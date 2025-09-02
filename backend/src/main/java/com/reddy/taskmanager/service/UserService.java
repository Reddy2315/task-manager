package com.reddy.taskmanager.service;

import com.reddy.taskmanager.dto.RegisterRequest;
import com.reddy.taskmanager.entity.Role;
import com.reddy.taskmanager.entity.User;
import com.reddy.taskmanager.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {
    private final UserRepository repo; private final PasswordEncoder encoder;
    public UserService(UserRepository repo, PasswordEncoder encoder){this.repo=repo; this.encoder=encoder;}


    public User register(RegisterRequest req){
        if (repo.existsByUsername(req.username())){
            throw new RuntimeException("Username taken");
        }
        User u = User.builder()
                .username(req.username())
                .password(encoder.encode(req.password()))
                .build();
        u.getRoles().add(Role.USER);
        return repo.save(u);
    }


    public User findByUsername(String username){
        return repo.findByUsername(username).orElseThrow();
    }


    public User findByUsernameOrNull(String username){
        return repo.findByUsername(username).orElse(null);
    }
}
