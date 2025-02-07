package xyz.efibalogh.eventhandler.dto.jwt;

import xyz.efibalogh.eventhandler.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
    private User user;

    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }
}
