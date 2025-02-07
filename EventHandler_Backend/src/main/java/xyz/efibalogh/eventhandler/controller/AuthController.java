package xyz.efibalogh.eventhandler.controller;

import xyz.efibalogh.eventhandler.dto.jwt.AuthResponse;
import xyz.efibalogh.eventhandler.dto.jwt.LoginRequest;
import xyz.efibalogh.eventhandler.dto.jwt.RegisterRequest;
import xyz.efibalogh.eventhandler.jwt.JwtUtil;
import xyz.efibalogh.eventhandler.model.User;
import xyz.efibalogh.eventhandler.service.TokenBlacklistService;
import xyz.efibalogh.eventhandler.service.JpaUserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JpaUserService jpaUserService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final TokenBlacklistService tokenBlacklistService;

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken() {
        log.info("GET /auth/validate");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return ResponseEntity.ok(new AuthResponse(null, "Token is valid", user));
        }

        return ResponseEntity.ok(new AuthResponse(null, "Token is valid", null));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        log.info("POST /auth/login - {}", loginRequest.getUsername());

        if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new AuthResponse(null, "Username and password must be provided", null));
        }

        if (tokenBlacklistService.isUserLoggedIn(loginRequest.getUsername())) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new AuthResponse(null, "User is already logged in. Please log out first.", null));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            User user = (User) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(user);
            tokenBlacklistService.addActiveUser(loginRequest.getUsername());
            user.setPassword(null);
            return ResponseEntity.ok(new AuthResponse(jwt, "Login successful", user));
        } catch (AuthenticationException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, "Invalid username or password", null));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        log.info("POST /auth/register - {}", registerRequest.getUsername());

        if (jpaUserService.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new AuthResponse(null, "Username is already in use!"));
        }

        if (jpaUserService.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new AuthResponse(null, "Email is already in use!"));
        }

        try {
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setEmail(registerRequest.getEmail());

            Long userId = jpaUserService.save(user);
            user.setPassword(null);
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new AuthResponse(null, "User registered successfully with id=" + userId, user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(null, "Error registering user", null));
        }
    }
}
