package xyz.efibalogh.eventhandler.dto.incoming;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EventIncoming {
    @NotNull(message = "Name is required!")
    private String name;

    @NotNull(message = "Location is required!")
    private String location;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "Start date is required!")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "End date is required!")
    private LocalDate endDate;

    @JsonIgnore
    @AssertTrue(message = "Start date must be before end date!")
     boolean isValidDateRange() {
        return !startDate.isAfter(endDate);
    }
}
