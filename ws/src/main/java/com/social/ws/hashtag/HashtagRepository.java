package com.social.ws.hashtag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HashtagRepository extends JpaRepository<Hashtag, Long> {

    Hashtag findByName(String name);

    List<Hashtag> findTop10ByOrderByPostCountDesc();
}
