package xyz.efibalogh.eventhandler.dto.incoming;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ParticipantIncoming {
    @NotNull(message = "Name is required!")
    private String name;

    @Email(message = "Invalid email format!")
    private String email;

    @Pattern(regexp = "^\\+?[1-9][0-9]{5,9}$", message = "Invalid phone number format!")
    private String phoneNumber;
}
