//package com.social.ws.user;
//
//import org.springframework.orm.hibernate5.support.HibernateDaoSupport;
//import org.springframework.stereotype.Repository;
//
//import javax.persistence.EntityManager;
//import javax.persistence.PersistenceContext;
//import javax.persistence.criteria.CriteriaBuilder;
//import javax.persistence.criteria.CriteriaQuery;
//import javax.persistence.criteria.Predicate;
//import javax.persistence.criteria.Root;
//import java.util.List;
//import java.util.logging.Handler;
//
//@Repository
//public class UserDAO extends HibernateDaoSupport {
//
//    @PersistenceContext
//    private EntityManager entityManager;
//
//    public List<User> getByUsername(String name) {
//        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//        CriteriaQuery<User> criteriaQuery = criteriaBuilder.createQuery(User.class);
//        Root<User> root = criteriaQuery.from(User.class);
//
//        Predicate condition = criteriaBuilder.equal(root.get("name"), name);
//        criteriaQuery.where(condition);
//
//        return entityManager.createQuery(criteriaQuery).getResultList();
//    }
//
////    public List<User> getByUsername(String name) {
////        String queryString = "SELECT u FROM User u WHERE u.name = :name";
////
////        List<User> users = entityManager.createQuery(queryString, User.class)
////                .setParameter("name", name)
////                .getResultList();
////
////        return users;
////    }
//}
