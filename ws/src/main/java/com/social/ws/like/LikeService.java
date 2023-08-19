package com.social.ws.like;

import com.social.ws.file.vm.FileAttachmentVM;
import com.social.ws.post.PostRepository;
import com.social.ws.post.vm.PostVM;
import com.social.ws.user.UserRepository;
import com.social.ws.user.vm.UserVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.social.ws.user.User;
import com.social.ws.post.Post;
import com.social.ws.like.Like;
import com.social.ws.like.LikeRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Autowired
    public LikeService(LikeRepository likeRepository, PostRepository postRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public boolean isPostLikedByUser(Post post, User user) {
        return likeRepository.existsByUserAndPost(user, post);
    }

    public List<Like> getLikesByUser(User user) {
        return likeRepository.findByUser(user);
    }

    public void likePost(User user, Post post) {
        Like like = new Like();
        like.setUser(user);
        like.setPost(post);
        likeRepository.save(like);

        post.getLikes().add(like);
    }

    public void unlikePost(User user, Post post) {
        Like like = likeRepository.findByUserAndPost(user, post);
        if (like != null) {
            likeRepository.delete(like);
            post.getLikes().remove(like);
        }
    }

    public Post getPostById(Long postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        return postOptional.orElse(null);
    }

    public long getLikeCountByPostId(Long postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            return post.getLikes().size();
        }
        return 0; // Gönderi bulunamadıysa veya beğeni yoksa 0 dönebilirsiniz.
    }

    public Page<PostVM> getLikedPostsByUsername(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username);
        Page<Like> likedPostsPage = likeRepository.findByUser(user, pageable);

        return likedPostsPage.map(like -> {
            Post post = like.getPost();
            PostVM postVM = new PostVM(post);
            return postVM;
        });
    }

}
