package xyz.efibalogh.eventhandler.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class EntityServiceException extends RuntimeException {
    public EntityServiceException(String message) {
        super(message);
    }

    public EntityServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
