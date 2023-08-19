package com.social.ws.like;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.social.ws.user.User;
import com.social.ws.post.Post;
import com.social.ws.like.Like;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserAndPost(User user, Post post);

    List<Like> findByUser(User user);

    Like findByUserAndPost(User user, Post post);

    Page<Like> findByUser(User user, Pageable page);

    boolean existsByPostIdAndUserUsername(Long postId, String username);
}
