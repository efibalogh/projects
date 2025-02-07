package xyz.efibalogh.eventhandler.service;

import xyz.efibalogh.eventhandler.model.User;
import xyz.efibalogh.eventhandler.repo.JpaUserDao;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Slf4j
@Service
public class JpaUserService implements UserDetailsService {
    @Autowired
    private JpaUserDao jpaUserDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Loading user by username: {}", username);
        return jpaUserDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public Collection<User> getAll() {
        return jpaUserDao.findAll();
    }

    public User getById(Long id) {
        return jpaUserDao.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    public Long save(User user) {
        return jpaUserDao.save(user).getId();
    }

    public void deleteById(Long id) {
        jpaUserDao.deleteById(id);
    }

    public boolean existsByUsername(String username) {
        return jpaUserDao.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return jpaUserDao.existsByEmail(email);
    }

    public boolean isCurrentUser(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        
        String currentUsername = authentication.getName();
        return jpaUserDao.findByUsername(currentUsername)
                .map(user -> user.getId().equals(id))
                .orElse(false);
    }

    public void updateTheme(Long id, String theme) {
        User user = getById(id);
        user.setTheme(theme);
        save(user);
    }

    public void updateLanguage(Long id, String language) {
        User user = getById(id);
        user.setLanguage(language);
        save(user);
    }
}
