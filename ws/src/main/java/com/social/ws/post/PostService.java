package com.social.ws.post;

import com.social.ws.error.NotFoundException;
import com.social.ws.file.FileAttachment;
import com.social.ws.file.FileAttachmentRepository;
import com.social.ws.file.FileService;
import com.social.ws.post.vm.PostSubmitVM;
import com.social.ws.post.vm.PostVM;
import com.social.ws.user.User;
import com.social.ws.user.UserRepository;
import com.social.ws.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final UserRepository userRepository;
    PostRepository postRepository;
    UserService userService;

    FileAttachmentRepository fileAttachmentRepository;

    FileService fileService;

    public PostService(PostRepository postRepository, UserService userService, FileAttachmentRepository fileAttachmentRepository, FileService fileService, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userService = userService;
        this.fileAttachmentRepository = fileAttachmentRepository;
        this.fileService = fileService;
        this.userRepository = userRepository;
    }

    public void save(PostSubmitVM postSubmitVM, User user) {
        Post post = new Post();
        post.setContent(postSubmitVM.getContent());
        post.setTimestamp(new Date());
        post.setUser(user);
        postRepository.save(post);
        Optional<FileAttachment> optionalFileAttachment = fileAttachmentRepository.findById(postSubmitVM.getAttachmentId());
        if (optionalFileAttachment.isPresent()) {
            FileAttachment fileAttachment = optionalFileAttachment.get();
            fileAttachment.setPost(post);
            fileAttachmentRepository.save(fileAttachment);
        }
    }

    public Page<Post> getPosts(Pageable page) {
        return postRepository.findAll(page);
    }

    public Page<Post> getPostsOfUser(String username, Pageable page) {
        User inDB = userService.getByUsername(username);
        return postRepository.findByUser(inDB, page);
    }

    public Page<Post> getOldPosts(long id, String username, Pageable page) {
        Specification<Post> specification = idLessThan(id);
        if (username != null) {
            User inDB = userService.getByUsername(username);
            specification = specification.and(userIs(inDB));
        }
        return postRepository.findAll(specification, page);
    }

    public long getNewPostCount(long id, String username) {
        Specification<Post> specification = idGreaterThan(id);
        if (username != null) {
            User inDB = userService.getByUsername(username);
            specification = specification.and(userIs(inDB));
        }
        return postRepository.count(specification);
    }


    public List<Post> getNewPosts(long id, String username, Sort sort) {
        Specification<Post> specification = idGreaterThan(id);
        if (username != null) {
            User inDB = userService.getByUsername(username);
            specification = specification.and(userIs(inDB));
        }
        return postRepository.findAll(specification, sort);
    }

    Specification<Post> idLessThan(long id) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.lessThan(root.get("id"), id);
        };
    }

    Specification<Post> userIs(User user) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("user"), user);
        };
    }

    Specification<Post> idGreaterThan(long id) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.greaterThan(root.get("id"), id);
        };
    }

    public void delete(long id) {
        Post inDB = postRepository.getOne(id);
        if (inDB.getFileAttachment() != null) {
            String filename = inDB.getFileAttachment().getName();
            fileService.deleteAttechmentFile(filename);
        }
        postRepository.deleteById(id);
    }

    public PostVM getPostDetails(long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException());
        return new PostVM(post);
    }

    public List<PostVM> getFollowingPosts(String username, Pageable page) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new NotFoundException();
        }

        List<User> followingUsers = user.getFollowing();
        List<Post> followingPosts = postRepository.findByUserInOrderByTimestampDesc(followingUsers, page);

        return followingPosts.stream()
                .map(PostVM::new)
                .collect(Collectors.toList());
    }


}
