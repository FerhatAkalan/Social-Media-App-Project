package com.social.ws.like;

import com.social.ws.post.vm.PostVM;
import com.social.ws.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.social.ws.user.User;
import com.social.ws.post.Post;
import com.social.ws.like.LikeService;

import java.util.List;

@RestController
@RequestMapping("/api/1.0/likes")
public class LikeController {

    private final LikeService likeService;
    private final UserRepository userRepository;

    private final LikeRepository likeRepository;

    @Autowired
    public LikeController(LikeService likeService, UserRepository userRepository, LikeRepository likeRepository) {
        this.likeService = likeService;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
    }

    @PostMapping("/like/{postId}/{username}")
    public ResponseEntity<?> likePost(@PathVariable Long postId, @PathVariable String username) {
        Post post = likeService.getPostById(postId);
        User user = userRepository.findByUsername(username);
        if (likeService.isPostLikedByUser(post, user)) {
            return ResponseEntity.badRequest().body("You've already liked this post.");
        }

        likeService.likePost(user, post);
        return ResponseEntity.ok("Post liked successfully.");
    }

    @PostMapping("/unlike/{postId}/{username}")
    public ResponseEntity<?> unlikePost(@PathVariable Long postId, @PathVariable String username) {
        Post post = likeService.getPostById(postId);
        User user = userRepository.findByUsername(username);
        if (!likeService.isPostLikedByUser(post, user)) {
            return ResponseEntity.badRequest().body("You haven't liked this post.");
        }

        likeService.unlikePost(user, post);
        return ResponseEntity.ok("Post unliked successfully.");
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        long likeCount = likeService.getLikeCountByPostId(postId);
        return ResponseEntity.ok(likeCount);
    }

    @GetMapping("/user/{username}/liked-posts")
    public ResponseEntity<Page<PostVM>> getLikedPostsByUsername(
            @PathVariable String username,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<PostVM> likedPostsPage = likeService.getLikedPostsByUsername(username, pageable);
        return ResponseEntity.ok(likedPostsPage);
    }

    @GetMapping("/check")
    public boolean checkLikeStatus(@RequestParam("postId") Long postId, @RequestParam("username") String username) {
        boolean isLiked = likeRepository.existsByPostIdAndUserUsername(postId, username);
        return isLiked;
    }
}
