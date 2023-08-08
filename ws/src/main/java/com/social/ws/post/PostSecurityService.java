package com.social.ws.post;

import com.social.ws.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostSecurityService {

    @Autowired
    PostRepository postRepository;

    public boolean isAllowedToDelete(long id, User loggedInUser) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (!optionalPost.isPresent()) {
            return false;
        }
        Post post = optionalPost.get();
        if (post.getUser().getId() != loggedInUser.getId()) {
            return false;
        }
        return true;
    }
}
