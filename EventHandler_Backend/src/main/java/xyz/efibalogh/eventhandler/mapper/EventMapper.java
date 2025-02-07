package xyz.efibalogh.eventhandler.mapper;

import xyz.efibalogh.eventhandler.dto.incoming.EventIncoming;
import xyz.efibalogh.eventhandler.dto.outgoing.EventOutgoing;
import xyz.efibalogh.eventhandler.model.Event;

import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Collection;

@Mapper(componentModel = "spring", uses = {ParticipantMapper.class})
public interface EventMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "participants", ignore = true)
    Event getEventFromDto(EventIncoming eventIncoming);

    @Mapping(target = "participants", source = "participants")
    EventOutgoing getDtoFromEvent(Event event);

    @IterableMapping(elementTargetType = EventOutgoing.class)
    Collection<EventOutgoing> getDtosFromEvents(Iterable<Event> events);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "participants", ignore = true)
    Event updateEventFromDto(EventIncoming eventIncoming, @MappingTarget Event event);
}