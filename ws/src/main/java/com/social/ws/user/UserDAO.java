package com.social.ws.user;

import com.social.ws.error.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class UserDAO {

    @PersistenceContext
    private EntityManager entityManager;

    public User getByUsername(String username) {
        String queryString = "SELECT u FROM User u WHERE u.username = :username";

        User user = entityManager.createQuery(queryString, User.class)
                .setParameter("username", username)
                .getSingleResult();

        if (user == null) {
            throw new NotFoundException();
        }

        return user;
    }
}
