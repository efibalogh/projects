package xyz.efibalogh.eventhandler.service;

import xyz.efibalogh.eventhandler.exception.DataAccessException;
import xyz.efibalogh.eventhandler.exception.EntityNotFoundException;
import xyz.efibalogh.eventhandler.exception.EntityServiceException;
import xyz.efibalogh.eventhandler.model.Event;
import xyz.efibalogh.eventhandler.repo.JpaEventDao;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;

@Slf4j
@Service
public class JpaEventService implements EventService {
    @Autowired
    private JpaEventDao eventDao;

    @Override
    public Long addEvent(Event event) {
        try {
            return eventDao.save(event).getId();
        } catch (DataIntegrityViolationException | JpaSystemException e) {
            log.error("Error adding event: {}", e.getMessage());
            throw new EntityServiceException("Error adding event: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Event> getById(Long id) {
        try {
            return eventDao.findById(id);
        } catch (JpaSystemException e) {
            log.error("Error retrieving event with id {}: {}", id, e.getMessage());
            throw new EntityServiceException("Error retrieving event!", e);
        }
    }

    @Override
    public Collection<Event> getAll() {
        try {
            return eventDao.findAll();
        } catch (JpaSystemException e) {
            log.error("Error retrieving all events: {}", e.getMessage());
            throw new EntityServiceException("Error retrieving all events!", e);
        }
    }

    @Override
    public void setById(Long id, Event event) throws EntityNotFoundException {
        try {
            Event existingEvent = eventDao.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Event with id=" + id + " not found!"));
            existingEvent.setName(event.getName());
            existingEvent.setLocation(event.getLocation());
            existingEvent.setStartDate(event.getStartDate());
            existingEvent.setEndDate(event.getEndDate());
            existingEvent.setParticipants(event.getParticipants());

            eventDao.save(existingEvent);
        } catch (JpaSystemException e) {
            log.error("Error updating event with id {}: {}", id, e.getMessage());
            throw new EntityServiceException("Error updating event!", e);
        }
    }

    @Override
    public void deleteById(Long id) throws EntityNotFoundException {
        try {
            if (!eventDao.existsById(id)) {
                throw new EntityNotFoundException("Event with id=" + id + " not found!");
            }
            eventDao.deleteById(id);
        } catch (JpaSystemException e) {
            log.error("Error deleting event with id {}: {}", id, e.getMessage());
            throw new EntityServiceException("Error deleting event!", e);
        }
    }

    @Override
    public Collection<Event> filterByName(String name) {
        try {
            return eventDao.filterByName(name);
        } catch (DataAccessException e) {
            log.error("Error retrieving events by name '{}': {}", name, e.getMessage());
            throw new EntityServiceException("Error retrieving events by name!", e);
        }
    }

    @Override
    public Collection<Event> filterByLocation(String location) {
        try {
            return eventDao.filterByLocation(location);
        } catch (DataAccessException e) {
            log.error("Error retrieving events by location '{}': {}", location, e.getMessage());
            throw new EntityServiceException("Error retrieving events by location!", e);
        }
    }

    @Override
    public Collection<Event> filterByStartDate(LocalDate startDate) {
        try {
            return eventDao.filterByStartDate(startDate);
        } catch (DataAccessException e) {
            log.error("Error retrieving events by start date '{}': {}", startDate, e.getMessage());
            throw new EntityServiceException("Error retrieving events by start date!", e);
        }
    }

    @Override
    public Collection<Event> filterByEndDate(LocalDate endDate) {
        try {
            return eventDao.filterByEndDate(endDate);
        } catch (DataAccessException e) {
            log.error("Error retrieving events by end date '{}': {}", endDate, e.getMessage());
            throw new EntityServiceException("Error retrieving events by end date!", e);
        }
    }

    @Override
    public Collection<Event> filterCombined(String name, String location, LocalDate startDate, LocalDate endDate) {
        try {
            return eventDao.filterCombined(name, location, startDate, endDate);
        } catch (DataAccessException e) {
            log.error("Error filtering events: {}", e.getMessage());
            throw new EntityServiceException("Error filtering events!", e);
        }
    }
}
