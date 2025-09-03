package com.reddy.taskmanager.controller;

import com.reddy.taskmanager.dto.*;
import com.reddy.taskmanager.entity.User;
import com.reddy.taskmanager.service.JwtService;
import com.reddy.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    private final PasswordEncoder encoder;

    private final JwtService jwt;

    public AuthController(UserService userService, PasswordEncoder encoder, JwtService jwt) {
        this.userService = userService;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        User u = userService.register(req);
        String token = jwt.generateToken(u.getUsername());
        return new AuthResponse(token);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest req) {
        User u = userService.findByUsernameOrNull(req.username());
        if (u == null || !encoder.matches(req.password(), u.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        String token = jwt.generateToken(u.getUsername());
        return new AuthResponse(token);
    }
}
