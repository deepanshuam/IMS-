
package com.inventory.controller;

import com.inventory.model.User;
import com.inventory.service.AuthService;
import com.inventory.service.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request) {

        try {
            String username = request.get("username");
            String password = request.get("password");
            String role = request.get("role");

            User user = authService.createUser(
                    username,
                    password,
                    role
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "id", user.getId(),
                            "username", user.getUsername(),
                            "role", user.getRole(),
                            "message", "User registered successfully."
                    )
            );

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage())
            );
        }
    }

    // Login and generate JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");

        if (username == null || username.isBlank()
                || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Username and password are required."
                    )
            );
        }

        User user = authService.login(username, password);

        if (user == null) {
            return ResponseEntity.status(
                    HttpStatus.UNAUTHORIZED
            ).body(
                    Map.of(
                            "message",
                            "Invalid username or password."
                    )
            );
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "role", user.getRole(),
                        "token", token
                )
        );
    }
}
