package com.social.ws.configuration;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JpaConfig {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public EntityManager getEntityManager() {
        return entityManager;
    }
}

