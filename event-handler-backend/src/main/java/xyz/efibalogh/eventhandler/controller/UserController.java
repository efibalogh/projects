package xyz.efibalogh.eventhandler.controller;

import xyz.efibalogh.eventhandler.dto.incoming.LanguageIncoming;
import xyz.efibalogh.eventhandler.dto.incoming.ThemeIncoming;
import xyz.efibalogh.eventhandler.model.User;
import xyz.efibalogh.eventhandler.service.JpaUserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final JpaUserService jpaUserService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public Collection<User> getAllUsers() {
        log.info("GET /users");
        return jpaUserService.getAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN') or @jpaUserService.isCurrentUser(#id)")
    public User getUserById(@PathVariable Long id) {
        log.info("GET /users/{}", id);
        return jpaUserService.getById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN') or @jpaUserService.isCurrentUser(#id)")
    public void deleteUser(@PathVariable Long id) {
        log.info("DELETE /users/{}", id);
        jpaUserService.deleteById(id);
    }

    @PutMapping("/{id}/theme")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN') or @jpaUserService.isCurrentUser(#id)")
    public void updateTheme(@PathVariable Long id, @RequestBody ThemeIncoming theme) {
        log.info("PUT /users/{}/theme - {}", id, theme.getTheme());
        jpaUserService.updateTheme(id, theme.getTheme());
    }

    @PutMapping("/{id}/language")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN') or @jpaUserService.isCurrentUser(#id)")
    public void updateLanguage(@PathVariable Long id, @RequestBody LanguageIncoming language) {
        log.info("PUT /users/{}/language - {}", id, language.getLanguage());
        jpaUserService.updateLanguage(id, language.getLanguage());
    }
}
