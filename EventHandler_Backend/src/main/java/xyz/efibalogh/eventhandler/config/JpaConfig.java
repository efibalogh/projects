package xyz.efibalogh.eventhandler.config;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableAutoConfiguration
@EntityScan("xyz.efibalogh.eventhandler.model")
@EnableJpaRepositories(basePackages = "xyz.efibalogh.eventhandler.repo")
public class JpaConfig {}
