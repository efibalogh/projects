package xyz.efibalogh.eventhandler.dto.outgoing;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.Collection;

@Data
public class EventOutgoing {
    private Long id;
    private String name;
    private String location;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private Collection<ParticipantOutgoing> participants;
}
