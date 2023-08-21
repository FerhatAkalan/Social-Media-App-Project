package com.social.ws.user;

import com.social.ws.configuration.AppConfiguration;
import com.social.ws.shared.CurrentUser;
import com.social.ws.shared.GenericResponse;
import com.social.ws.user.vm.UserUpdateVM;
import com.social.ws.user.vm.UserVM;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/1.0")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private AppConfiguration appConfiguration;

    @PostMapping("/users")
    public GenericResponse createUser(@Valid @RequestBody User user) {
        userService.save(user);
        return new GenericResponse("user created");
    }

    @GetMapping("/users")
    Page<UserVM> getUser(Pageable page, @CurrentUser User user) {
        return userService.getUsers(page, user).map(UserVM::new);
    }

    @GetMapping("/users/{username}")
    UserVM getUser(@PathVariable String username) {
        User user = userService.getByUsername(username);
        return new UserVM(user);
    }

    @PutMapping("/users/{username}")
    @PreAuthorize("#username == principal.username or hasRole('ADMIN')")
    UserVM updateUser(@Valid @RequestBody UserUpdateVM updatedUser, @PathVariable String username) {
        User user = userService.updateUser(username, updatedUser);
        return new UserVM(user);
    }

    @DeleteMapping("/users/{username}")
    @PreAuthorize("#username == principal.username or hasRole('ADMIN')")
    GenericResponse deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
        return new GenericResponse("User is removed");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping("/images/verified/{filename:.+}")
    public ResponseEntity<?> getProtectedImage(@PathVariable String filename) {
        String filePath = appConfiguration.getVerifiedStorage() + "/" + filename;
        File file = new File(filePath);

        if (file.exists() && file.canRead()) {
            try {
                Path path = Paths.get(filePath);
                byte[] fileBytes = Files.readAllBytes(path);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("inline", filename);

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(fileBytes);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/users/{followerUsername}/follow/{followedUsername}")
    @PreAuthorize("#followerUsername == principal.username or hasRole('ADMIN')")
    GenericResponse followUser(@PathVariable String followerUsername, @PathVariable String followedUsername) {
        if (!followerUsername.equals(followedUsername) && !userService.isAlreadyFollowing(followerUsername, followedUsername)) {
            userService.followUser(followerUsername, followedUsername);
            return new GenericResponse("User followed");
        } else if (followerUsername.equals(followedUsername)) {
            return new GenericResponse("Cannot follow yourself");
        } else {
            return new GenericResponse("Already following this user");
        }
    }

    @PreAuthorize("#followerUsername == principal.username or hasRole('ADMIN')")
    @PostMapping("/users/{followerUsername}/unfollow/{followedUsername}")
    GenericResponse unfollowUser(@PathVariable String followerUsername, @PathVariable String followedUsername) {
        userService.unfollowUser(followerUsername, followedUsername);
        return new GenericResponse("User unfollowed");
    }

    @GetMapping("/users/{username}/following")
    public List<UserVM> getFollowing(@PathVariable String username) {
        List<User> following = userService.getFollowing(username);
        return following.stream().map(UserVM::new).collect(Collectors.toList());
    }

    @GetMapping("/users/{username}/followers")
    public List<UserVM> getFollowers(@PathVariable String username) {
        List<User> followers = userService.getFollowers(username);
        return followers.stream().map(UserVM::new).collect(Collectors.toList());
    }

    @GetMapping("/users/{followerUsername}/is-following/{followedUsername}")
    public ResponseEntity<?> checkFollowStatus(@PathVariable String followerUsername, @PathVariable String followedUsername) {
        boolean isFollowing = userService.isAlreadyFollowing(followerUsername, followedUsername);
        return ResponseEntity.ok(isFollowing);
    }

}
