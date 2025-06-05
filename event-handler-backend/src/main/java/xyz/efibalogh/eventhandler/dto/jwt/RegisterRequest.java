package xyz.efibalogh.eventhandler.dto.jwt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RegisterRequest extends LoginRequest {
    private String email;
}
