package xyz.efibalogh.eventhandler.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Collection;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "Events")
public class Event extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Participant> participants;

    public Event(String name, String location, LocalDate startDate, LocalDate endDate) {
        super();
        this.name = name;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
