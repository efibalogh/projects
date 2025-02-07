package xyz.efibalogh.eventhandler.repo;

import xyz.efibalogh.eventhandler.exception.DataAccessException;
import xyz.efibalogh.eventhandler.model.Event;
import xyz.efibalogh.eventhandler.model.Participant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface JpaParticipantDao extends JpaRepository<Participant, Long> {
    @Query("SELECT p FROM Participant p WHERE p.name LIKE %:name%")
    Collection<Participant> filterByName(@Param("name") String name) throws DataAccessException;

    @Query("SELECT p FROM Participant p WHERE p.email LIKE %:email%")
    Collection<Participant> filterByEmail(@Param("email") String email) throws DataAccessException;

    @Query("SELECT p FROM Participant p WHERE p.phoneNumber LIKE %:phoneNumber%")
    Collection<Participant> filterByPhoneNumber(@Param("phoneNumber") String phoneNumber) throws DataAccessException;

    @Query("SELECT p FROM Participant p WHERE p.event = :event")
    Collection<Participant> filterByEvent(@Param("event") Event event) throws DataAccessException;
}
