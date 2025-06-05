package xyz.efibalogh.eventhandler.controller;

import xyz.efibalogh.eventhandler.dto.incoming.ParticipantIncoming;
import xyz.efibalogh.eventhandler.dto.outgoing.ParticipantOutgoing;
import xyz.efibalogh.eventhandler.exception.EntityNotFoundException;
import xyz.efibalogh.eventhandler.mapper.ParticipantMapper;
import xyz.efibalogh.eventhandler.model.Event;
import xyz.efibalogh.eventhandler.model.Participant;
import xyz.efibalogh.eventhandler.service.EventService;
import xyz.efibalogh.eventhandler.service.ParticipantService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Slf4j
@RestController
@RequestMapping("/events/{eventId}/participants")
@RequiredArgsConstructor
public class ParticipantController {
    private final ParticipantService participantService;
    private final EventService eventService;
    private final ParticipantMapper participantMapper;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Collection<ParticipantOutgoing> getAll(
            @PathVariable("eventId") Long eventId
    ) throws EntityNotFoundException {
        log.info("GET /events/{}/participants", eventId);
        Event event = eventService.getById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id=" + eventId + " not found"));
        Collection<Participant> participants = event.getParticipants();

        return participantMapper.getDtosFromParticipants(participants);
    }

    @GetMapping("/{participantId}")
    @ResponseStatus(HttpStatus.OK)
    public ParticipantOutgoing getById(
            @PathVariable("eventId") Long eventId,
            @PathVariable("participantId") Long participantId
    ) throws EntityNotFoundException {
        log.info("GET /events/{}/participants/{}", eventId, participantId);

        Participant participant = checkParticipantBelongsToEvent(eventId, participantId);
        return participantMapper.getDtoFromParticipant(participant);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Long addParticipant(
            @PathVariable("eventId") Long eventId,
            @Valid @RequestBody ParticipantIncoming participantIncoming
    ) throws EntityNotFoundException {
        log.info("POST /events/{}/participants", eventId);
        Event event = eventService.getById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id=" + eventId + " not found"));
        
        Participant participant = participantMapper.getParticipantFromDto(participantIncoming);
        participant.setEvent(event);

        return participantService.addParticipant(participant);
    }

    @PutMapping("/{participantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateParticipant(
            @PathVariable("eventId") Long eventId,
            @PathVariable("participantId") Long participantId,
            @Valid @RequestBody ParticipantIncoming participantIncoming
    ) throws EntityNotFoundException {
        log.info("PUT /events/{}/participants/{}", eventId, participantId);

        Participant participant = checkParticipantBelongsToEvent(eventId, participantId);
        Participant updatedParticipant = participantMapper.updateParticipantFromDto(participantIncoming, participant);
        participantService.setById(participantId, updatedParticipant);
    }

    @DeleteMapping("/{participantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteParticipant(
            @PathVariable("eventId") Long eventId,
            @PathVariable("participantId") Long participantId
    ) throws EntityNotFoundException {
        log.info("DELETE /events/{}/participants/{}", eventId, participantId);

        checkParticipantBelongsToEvent(eventId, participantId);
        participantService.deleteById(participantId);
    }

    private Participant checkParticipantBelongsToEvent(
            Long eventId,
            Long participantId
    ) throws EntityNotFoundException {
        eventService.getById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id=" + eventId + " not found"));
        Participant participant = participantService.getById(participantId)
                .orElseThrow(() -> new EntityNotFoundException("Participant with id=" + participantId + " not found"));

        if (!participant.getEvent().getId().equals(eventId)) {
            throw new IllegalArgumentException("Participant does not belong to the specified event");
        }

        return participant;
    }
}
