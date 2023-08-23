package com.social.ws.user;

import com.social.ws.error.NotFoundException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserDAO {

    private final SessionFactory sessionFactory;

    @Autowired
    public UserDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public User getByUsername(String username) {
        try (Session session = sessionFactory.openSession()) {
            String queryString = "FROM User WHERE username = :username";

            User user = session.createQuery(queryString, User.class)
                    .setParameter("username", username)
                    .uniqueResult();

            if (user == null) {
                throw new NotFoundException();
            }

            return user;
        }
    }
}
