package xyz.efibalogh.eventhandler.dto.jwt;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
