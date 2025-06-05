package xyz.efibalogh.eventhandler.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class TokenBlacklistService {
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();
    private final Set<String> activeUsers = ConcurrentHashMap.newKeySet();

    public void blacklistToken(String token) {
        log.info("Blacklisting token: {}", token);
        if (token == null) {
            throw new IllegalArgumentException("Token cannot be null");
        }
        blacklistedTokens.add(token);
    }

    public boolean isBlacklisted(String token) {
        log.info("Checking if token is blacklisted: {}", token);
        if (token == null) {
            throw new IllegalArgumentException("Token cannot be null");
        }
        return blacklistedTokens.contains(token);
    }

    public boolean isUserLoggedIn(String username) {
        log.info("Checking if user is logged in: {}", username);
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        return activeUsers.contains(username);
    }

    public void addActiveUser(String username) {
        log.info("Adding active user: {}", username);
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        activeUsers.add(username);
    }

    public void removeActiveUser(String username) {
        log.info("Removing active user: {}", username);
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        activeUsers.remove(username);
    }
}
