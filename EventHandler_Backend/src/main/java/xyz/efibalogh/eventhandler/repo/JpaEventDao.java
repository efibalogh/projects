package xyz.efibalogh.eventhandler.repo;

import xyz.efibalogh.eventhandler.exception.DataAccessException;
import xyz.efibalogh.eventhandler.model.Event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;

@Repository
public interface JpaEventDao extends JpaRepository<Event, Long> {
    @Query("SELECT e FROM Event e WHERE e.name LIKE %:name%")
    Collection<Event> filterByName(@Param("name") String name) throws DataAccessException;

    @Query("SELECT e FROM Event e WHERE e.location LIKE %:location%")
    Collection<Event> filterByLocation(@Param("location") String location) throws DataAccessException;

    @Query("SELECT e FROM Event e WHERE e.startDate >= :startDate")
    Collection<Event> filterByStartDate(@Param("startDate") LocalDate startDate) throws DataAccessException;

    @Query("SELECT e FROM Event e WHERE e.endDate <= :endDate")
    Collection<Event> filterByEndDate(@Param("endDate") LocalDate endDate) throws DataAccessException;

    @Query("SELECT e FROM Event e WHERE "
         + "(:name IS NULL OR e.name LIKE %:name%) AND "
         + "(:location IS NULL OR e.location LIKE %:location%) AND "
         + "(:startDate IS NULL OR e.startDate >= :startDate) AND "
         + "(:endDate IS NULL OR e.endDate <= :endDate)")
    Collection<Event> filterCombined(
            @Param("name") String name,
            @Param("location") String location,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    ) throws DataAccessException;
}