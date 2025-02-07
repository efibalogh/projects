package xyz.efibalogh.eventhandler.service;

import xyz.efibalogh.eventhandler.exception.DataAccessException;
import xyz.efibalogh.eventhandler.exception.EntityNotFoundException;
import xyz.efibalogh.eventhandler.exception.EntityServiceException;
import xyz.efibalogh.eventhandler.model.Event;
import xyz.efibalogh.eventhandler.model.Participant;
import xyz.efibalogh.eventhandler.repo.JpaParticipantDao;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Slf4j
@Service
public class JpaParticipantService implements ParticipantService {
    @Autowired
    private JpaParticipantDao participantDao;

    @Override
    public Long addParticipant(Participant participant) {
        try {
            return participantDao.save(participant).getId();
        } catch (DataIntegrityViolationException | JpaSystemException e) {
            log.error("Error adding participant: {}", e.getMessage());
            throw new EntityServiceException("Error adding participant: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Participant> getById(Long id) throws EntityNotFoundException {
        try {
            return participantDao.findById(id);
        } catch (JpaSystemException e) {
            log.error("Error retrieving participant with id {}: {}", id, e.getMessage());
            throw new EntityNotFoundException("Participant with id=" + id + " not found!", e);
        }
    }

    @Override
    public Collection<Participant> getAll() {
        try {
            return participantDao.findAll();
        } catch (JpaSystemException e) {
            log.error("Error retrieving all participants: {}", e.getMessage());
            throw new EntityServiceException("Error retrieving all participants!", e);
        }
    }

    @Override
    public void setById(Long id, Participant participant) throws EntityNotFoundException {
        try {
            Participant existingParticipant = participantDao.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Participant with id=" + id + " not found!"));
            existingParticipant.setName(participant.getName());
            existingParticipant.setEmail(participant.getEmail());
            existingParticipant.setPhoneNumber(participant.getPhoneNumber());
            existingParticipant.setEvent(participant.getEvent());

            participantDao.save(existingParticipant);
        } catch (JpaSystemException e) {
            log.error("Error updating participant with id {}: {}", id, e.getMessage());
            throw new EntityNotFoundException("Participant with id=" + id + " not found!", e);
        }
    }

    @Override
    public void deleteById(Long id) throws EntityNotFoundException {
        try {
            if (!participantDao.existsById(id)) {
                throw new EntityNotFoundException("Participant with id=" + id + " not found!");
            }
            participantDao.deleteById(id);
        } catch (JpaSystemException e) {
            log.error("Error deleting participant with id {}: {}", id, e.getMessage());
            throw new EntityNotFoundException("Participant with id=" + id + " not found!", e);
        }
    }

    @Override
    public Collection<Participant> filterByName(String name) {
        try {
            return participantDao.filterByName(name);
        } catch (DataAccessException e) {
            log.error("Error filtering participants by name {}: {}", name, e.getMessage());
            throw new EntityServiceException("Error filtering participants by name!", e);
        }
    }

    @Override
    public Collection<Participant> filterByEmail(String email) {
        try {
            return participantDao.filterByEmail(email);
        } catch (DataAccessException e) {
            log.error("Error filtering participants by email {}: {}", email, e.getMessage());
            throw new EntityServiceException("Error filtering participants by email!", e);
        }
    }

    @Override
    public Collection<Participant> filterByPhoneNumber(String phoneNumber) {
        try {
            return participantDao.filterByPhoneNumber(phoneNumber);
        } catch (DataAccessException e) {
            log.error("Error filtering participants by phone number {}: {}", phoneNumber, e.getMessage());
            throw new EntityServiceException("Error filtering participants by phone number!", e);
        }
    }

    @Override
    public Collection<Participant> filterByEvent(Event event) {
        try {
            return participantDao.filterByEvent(event);
        } catch (DataAccessException e) {
            log.error("Error filtering participants by event {}: {}", event, e.getMessage());
            throw new EntityServiceException("Error filtering participants by event!", e);
        }
    }
}
