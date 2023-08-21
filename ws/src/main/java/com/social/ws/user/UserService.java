package com.social.ws.user;

import com.social.ws.error.NotFoundException;
import com.social.ws.file.FileService;
import com.social.ws.user.vm.UserUpdateVM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.util.List;


@Service
public class UserService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    FileService fileService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, FileService fileService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
    }

    public void save(User user) {
        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public Page<User> getUsers(Pageable page, User user) {
        if (user != null) {
            return userRepository.findByUsernameNot(user.getUsername(), page);
        }
        return userRepository.findAll(page);
    }

    public User getByUsername(String username) {
        User inDB = userRepository.findByUsername((username));
        if (inDB == null) {
            throw new NotFoundException();
        }
        return inDB;
    }

    public User updateUser(String username, UserUpdateVM updatedUser) {
        User inDB = getByUsername(username);
        inDB.setDisplayName(updatedUser.getDisplayName());
        if (updatedUser.getImage() != null) {
            String oldImageName = inDB.getImage();
            try {
                String storedFileName = fileService.writeBase64EncodedStringToFile(updatedUser.getImage());
                inDB.setImage(storedFileName);
            } catch (IOException e) {
                e.printStackTrace();
            }
            fileService.deleteProfileImage(oldImageName);
        }
        return userRepository.save(inDB);
    }


    public void deleteUser(String username) {
        User inDB = userRepository.findByUsername(username);
        fileService.deleteAllStoredFilesForUser(inDB);
        userRepository.delete(inDB);
    }

    public boolean isAlreadyFollowing(String followerUsername, String followedUsername) {
        User follower = userRepository.findByUsername(followerUsername);
        User followedUser = userRepository.findByUsername(followedUsername);

        return follower.getFollowing().contains(followedUser);
    }

    public void followUser(String followerUsername, String followedUsername) {
        User follower = userRepository.findByUsername(followerUsername);
        User followedUser = userRepository.findByUsername(followedUsername);

        follower.getFollowing().add(followedUser);
        followedUser.getFollowers().add(follower);

        userRepository.saveAll(List.of(follower, followedUser));
    }

    public void unfollowUser(String followerUsername, String followedUsername) {
        User follower = userRepository.findByUsername(followerUsername);
        User followedUser = userRepository.findByUsername(followedUsername);

        follower.getFollowing().remove(followedUser);
        followedUser.getFollowers().remove(follower);

        userRepository.saveAll(List.of(follower, followedUser));
    }

    public List<User> getFollowing(String username) {
        User user = userRepository.findByUsername(username);

        if (user != null) {
            return user.getFollowing();
        } else {
            throw new NotFoundException();
        }
    }

    public List<User> getFollowers(String username) {
        User user = userRepository.findByUsername(username);

        if (user != null) {
            return user.getFollowers();
        } else {
            throw new NotFoundException();
        }
    }

}
