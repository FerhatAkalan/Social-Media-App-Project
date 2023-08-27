package com.social.ws.hashtag;

import com.social.ws.error.NotFoundException;
import com.social.ws.post.Post;
import com.social.ws.post.vm.PostVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HashtagService {

    private final HashtagRepository hashtagRepository;

    @Autowired
    public HashtagService(HashtagRepository hashtagRepository) {
        this.hashtagRepository = hashtagRepository;
    }

    public Hashtag createHashtag(String name) {
        Hashtag hashtag = new Hashtag();
        hashtag.setName(name);
        hashtag.setPostCount(hashtag.getPosts().size());
        return hashtagRepository.save(hashtag);
    }

    public Hashtag findOrCreateHashtag(String name) {
        Hashtag existingHashtag = hashtagRepository.findByName(name);
        if (existingHashtag != null) {
            return existingHashtag;
        }
        return createHashtag(name);
    }

    public List<PostVM> getPostsByHashtag(String hashtagName) {
        Hashtag hashtag = hashtagRepository.findByName(hashtagName);
        if (hashtag == null) {
            throw new NotFoundException();
        }
        List<Post> posts = hashtag.getPosts();
        List<PostVM> postVMs = posts.stream()
                .sorted(Comparator.comparing(Post::getTimestamp).reversed()) // En son atılan post üstte
                .map(PostVM::new)
                .collect(Collectors.toList());

        return postVMs;
    }

    public int getHashtagPostCount(String hashtagName) {
        Hashtag hashtag = hashtagRepository.findByName(hashtagName);
        if (hashtag != null) {
            hashtag.setPostCount(hashtag.getPosts().size());
            hashtagRepository.save(hashtag);
            return hashtag.getPosts().size();
        }
        return 0;
    }

    public List<Hashtag> getTopHashtags() {
        List<Hashtag> hashtags = hashtagRepository.findAll();

        for (Hashtag hashtag : hashtags) {
            int postCount = getHashtagPostCount(hashtag.getName());
            hashtag.setPostCount(postCount);
            hashtagRepository.save(hashtag);
        }
        return hashtagRepository.findTop10ByOrderByPostCountDesc();
    }
}
