package xyz.efibalogh.eventhandler.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "Participants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"email", "event_id"}),
    @UniqueConstraint(columnNames = {"phoneNumber", "event_id"})
})
public class Participant extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @Column
    private String email;

    @Column
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}
