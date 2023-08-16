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


}
