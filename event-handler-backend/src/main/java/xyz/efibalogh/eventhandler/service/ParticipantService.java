package xyz.efibalogh.eventhandler.service;

import xyz.efibalogh.eventhandler.exception.EntityNotFoundException;
import xyz.efibalogh.eventhandler.model.Event;
import xyz.efibalogh.eventhandler.model.Participant;

import java.util.Collection;
import java.util.Optional;

public interface ParticipantService {
    Long addParticipant(Participant participant);

    Optional<Participant> getById(Long id) throws EntityNotFoundException;

    Collection<Participant> getAll();

    void setById(Long id, Participant participant) throws EntityNotFoundException;

    void deleteById(Long id) throws EntityNotFoundException;

    Collection<Participant> filterByName(String name);

    Collection<Participant> filterByEmail(String email);

    Collection<Participant> filterByPhoneNumber(String phoneNumber);

    Collection<Participant> filterByEvent(Event event);
}
