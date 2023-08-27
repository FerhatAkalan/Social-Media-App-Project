package com.social.ws.post;

import com.social.ws.error.NotFoundException;
import com.social.ws.file.FileAttachment;
import com.social.ws.file.FileAttachmentRepository;
import com.social.ws.file.FileService;
import com.social.ws.hashtag.Hashtag;
import com.social.ws.hashtag.HashtagRepository;
import com.social.ws.hashtag.HashtagService;
import com.social.ws.post.vm.PostSubmitVM;
import com.social.ws.post.vm.PostVM;
import com.social.ws.user.User;
import com.social.ws.user.UserRepository;
import com.social.ws.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    @Autowired
    HashtagRepository hashtagRepository;
    @Autowired
    HashtagService hashtagService;

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
        List<Hashtag> hashtags = extractHashtags(postSubmitVM.getContent());
        post.setHashtags(hashtags);
        postRepository.save(post);
        Optional<FileAttachment> optionalFileAttachment = fileAttachmentRepository.findById(postSubmitVM.getAttachmentId());
        if (optionalFileAttachment.isPresent()) {
            FileAttachment fileAttachment = optionalFileAttachment.get();
            fileAttachment.setPost(post);
            fileAttachmentRepository.save(fileAttachment);
        }
    }

    private List<Hashtag> extractHashtags(String content) {
        List<Hashtag> hashtags = new ArrayList<>();
        String[] words = content.split(" ");

        for (String word : words) {
            if (word.startsWith("#")) {
                String hashtagName = word.substring(1);
                Hashtag hashtag = hashtagRepository.findByName(hashtagName);
                if (hashtag == null) {
                    hashtag = new Hashtag();
                    hashtag.setName(hashtagName);
                    hashtag.setPostCount(1);
                    hashtagRepository.save(hashtag);
                } else {
                    hashtag.setPostCount(hashtag.getPostCount() + 1);
                }
                hashtags.add(hashtag);
            }
        }

        return hashtags;
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

    @Transactional
    public void delete(long id) {
        Post inDB = postRepository.getOne(id);
        if (inDB.getFileAttachment() != null) {
            String filename = inDB.getFileAttachment().getName();
            fileService.deleteAttechmentFile(filename);
        }
        List<Hashtag> hashtags = inDB.getHashtags();
        for (Hashtag hashtag : hashtags) {
            hashtag.getPosts().remove(inDB);// Post'u hashtagin ilişkili post listesinden çıkar
        }
        for (Hashtag hashtag : hashtags) {
            hashtag.setPostCount(hashtagService.getHashtagPostCount(hashtag.getName())); // Post sayısını güncelle
            if (hashtag.getPostCount() == 0) {
                hashtagRepository.delete(hashtag); // Post sayısı 0 ise hashtag'i sil
            } else {
                hashtagRepository.save(hashtag); // Post sayısı sıfır değilse güncellenmiş hashtag'i kaydet
            }
        }
        postRepository.deleteById(id); // Post'u sil
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
