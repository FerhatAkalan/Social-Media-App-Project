package com.social.ws.post;

import com.social.ws.post.vm.PostSubmitVM;
import com.social.ws.post.vm.PostVM;
import com.social.ws.shared.CurrentUser;
import com.social.ws.shared.GenericResponse;
import com.social.ws.user.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/1.0")
public class PostController {
    @Autowired
    PostService postService;

    @PostMapping("/posts")
    GenericResponse savePost(@Valid @RequestBody PostSubmitVM post, @CurrentUser User user) {
        postService.save(post, user);
        return new GenericResponse("Post is save");
    }

    @GetMapping("/posts")
    Page<PostVM> getPosts(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page) {
        return postService.getPosts(page).map(PostVM::new);
    }

    @GetMapping({"/posts/{id:[0-9]+}", "/users/{username}/posts/{id:[0-9]+}"})
    ResponseEntity<?> getPostsRelative(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page,
                                       @PathVariable long id,
                                       @PathVariable(required = false) String username,
                                       @RequestParam(name = "count", required = false, defaultValue = "false") boolean count,
                                       @RequestParam(name = "direction", defaultValue = "before") String direction) {
        if (count) {
            long newPostCount = postService.getNewPostCount(id, username);
            Map<String, Long> response = new HashMap<>();
            response.put("count", newPostCount);
            return ResponseEntity.ok(response);
        }
        if (direction.equals("after")) {
            List<PostVM> newPosts = postService.getNewPosts(id, username, page.getSort()).stream().map(PostVM::new).collect(Collectors.toList());
            return ResponseEntity.ok(newPosts);
        }
        return ResponseEntity.ok(postService.getOldPosts(id, username, page).map(PostVM::new));
    }

    @GetMapping("/users/{username}/posts")
    Page<PostVM> getUserPosts(@PathVariable String username, @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page) {
        return postService.getPostsOfUser(username, page).map(PostVM::new);
    }

    @DeleteMapping("/posts/{id:[0-9]+}")//Principal = loggedinuser
    @PreAuthorize("@postSecurityService.isAllowedToDelete(#id, principal) or hasRole('ADMIN')")
    GenericResponse deletePost(@PathVariable long id) {
        postService.delete(id);
        return new GenericResponse("Post removed");
    }


}
