package xyz.efibalogh.eventhandler.dto.outgoing;

import lombok.Data;

@Data
public class ParticipantOutgoing {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private Long eventId;
}
