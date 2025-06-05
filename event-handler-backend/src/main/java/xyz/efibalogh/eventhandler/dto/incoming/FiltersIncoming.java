package xyz.efibalogh.eventhandler.dto.incoming;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FiltersIncoming {
    private String name;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
}
