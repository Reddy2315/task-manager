package com.reddy.taskmanager.controller;

import com.reddy.taskmanager.dto.*;
import com.reddy.taskmanager.entity.User;
import com.reddy.taskmanager.service.JwtService;
import com.reddy.taskmanager.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {

        User user = userService.register(req);
        String token = jwt.generateToken(user.getUsername());

        return new AuthResponse(token);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {

        User user = userService.findByUsernameOrNull(req.username());

        if (user == null || !encoder.matches(req.password(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid username or password"));
        }

        String token = jwt.generateToken(user.getUsername());

        return ResponseEntity.ok(new AuthResponse(token));
    }
}
