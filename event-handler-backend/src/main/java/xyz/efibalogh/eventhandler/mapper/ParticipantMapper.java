package xyz.efibalogh.eventhandler.mapper;

import xyz.efibalogh.eventhandler.dto.incoming.ParticipantIncoming;
import xyz.efibalogh.eventhandler.dto.outgoing.ParticipantOutgoing;
import xyz.efibalogh.eventhandler.model.Participant;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface ParticipantMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "event", ignore = true)
    Participant getParticipantFromDto(ParticipantIncoming participantIncoming);

    @Mapping(target = "eventId", source = "event.id")
    ParticipantOutgoing getDtoFromParticipant(Participant participant);

    Collection<ParticipantOutgoing> getDtosFromParticipants(Collection<Participant> participants);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "event", ignore = true)
    Participant updateParticipantFromDto(
            ParticipantIncoming participantIncoming,
            @MappingTarget Participant participant
    );
}
