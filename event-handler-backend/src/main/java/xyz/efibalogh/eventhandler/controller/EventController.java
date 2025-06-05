package xyz.efibalogh.eventhandler.controller;

import xyz.efibalogh.eventhandler.dto.incoming.FiltersIncoming;
import xyz.efibalogh.eventhandler.dto.incoming.EventIncoming;
import xyz.efibalogh.eventhandler.dto.outgoing.EventOutgoing;
import xyz.efibalogh.eventhandler.exception.EntityNotFoundException;
import xyz.efibalogh.eventhandler.mapper.EventMapper;
import xyz.efibalogh.eventhandler.model.Event;
import xyz.efibalogh.eventhandler.service.EventService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collection;

@Slf4j
@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;
    private final EventMapper eventMapper;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Collection<EventOutgoing> getAllEvents(
            @RequestParam(value = "name",      required = false) String name,
            @RequestParam(value = "location",  required = false) String location,
            @RequestParam(value = "startDate", required = false) LocalDate startDate,
            @RequestParam(value = "endDate",   required = false) LocalDate endDate
    ) {
        String filterParams = buildFilterParamsString(name, location, startDate, endDate);

        if (!filterParams.isEmpty()) {
            log.info("GET /events - {}", filterParams);
            return eventMapper.getDtosFromEvents(eventService.filterCombined(name, location, startDate, endDate));
        }

        log.info("GET /events");
        return eventMapper.getDtosFromEvents(eventService.getAll());
    }

    @PostMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    public Collection<EventOutgoing> searchEvents(@RequestBody FiltersIncoming eventFilter) {
        log.info("POST /events/search");

        return eventMapper.getDtosFromEvents(eventService.filterCombined(
                eventFilter.getName(),
                eventFilter.getLocation(),
                eventFilter.getStartDate(),
                eventFilter.getEndDate()
        ));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EventOutgoing getEventById(@PathVariable("id") Long id) throws EntityNotFoundException {
        log.info("GET /events/{}", id);
        Event event = eventService.getById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event with id=" + id + " not found"));
        return eventMapper.getDtoFromEvent(event);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Long addEvent(@RequestBody @Valid EventIncoming eventIncoming) {
        log.info("POST /events");
        return eventService.addEvent(eventMapper.getEventFromDto(eventIncoming));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateEvent(
            @PathVariable("id") Long id,
            @RequestBody @Valid EventIncoming eventIncoming
    ) throws EntityNotFoundException {
        log.info("PUT /events/{}", id);
        Event event = eventService.getById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event with id=" + id + " not found"));
        eventService.setById(id, eventMapper.updateEventFromDto(eventIncoming, event));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable("id") Long id) throws EntityNotFoundException {
        log.info("DELETE /events/{}", id);
        eventService.deleteById(id);
    }

    private String buildFilterParamsString(Object... params) {
        String[] paramNames = {"name", "location", "startDate", "endDate"};
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < params.length; i++) {
            if (params[i] != null && !params[i].toString().isEmpty()) {
                sb.append(String.format("%s: '%s', ", paramNames[i], params[i]));
            }
        }
        if (!sb.isEmpty()) {
            sb.delete(sb.length() - 2, sb.length());
        }
        return sb.toString();
    }
}
