package xyz.efibalogh.eventhandler.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.sql.SQLException;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class DataAccessException extends SQLException {
    public DataAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
