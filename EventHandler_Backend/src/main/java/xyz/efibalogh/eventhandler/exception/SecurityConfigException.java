package xyz.efibalogh.eventhandler.exception;

import java.io.IOException;

public class SecurityConfigException extends IOException {
    public SecurityConfigException(String message) {
        super(message);
    }

    public SecurityConfigException(String message, Throwable cause) {
        super(message, cause);
    }
}
