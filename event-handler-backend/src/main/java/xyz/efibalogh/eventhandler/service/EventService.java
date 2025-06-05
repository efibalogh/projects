package xyz.efibalogh.eventhandler.service;

import xyz.efibalogh.eventhandler.exception.EntityNotFoundException;
import xyz.efibalogh.eventhandler.model.Event;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;

public interface EventService {
    Long addEvent(Event event);

    Optional<Event> getById(Long id) throws EntityNotFoundException;

    Collection<Event> getAll();

    void setById(Long id, Event event) throws EntityNotFoundException;

    void deleteById(Long id) throws EntityNotFoundException;

    Collection<Event> filterByName(String name);

    Collection<Event> filterByLocation(String location);

    Collection<Event> filterByStartDate(LocalDate startDate);

    Collection<Event> filterByEndDate(LocalDate endDate);

    Collection<Event> filterCombined(String name, String location, LocalDate startDate, LocalDate endDate);
}
