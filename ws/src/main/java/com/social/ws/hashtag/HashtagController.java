package com.social.ws.hashtag;

import com.social.ws.post.vm.PostVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/1.0/hashtags")
public class HashtagController {

    private final HashtagService hashtagService;

    @Autowired
    public HashtagController(HashtagService hashtagService) {
        this.hashtagService = hashtagService;
    }

    @PostMapping
    public ResponseEntity<Hashtag> createHashtag(@RequestBody HashtagRequest hashtagRequest) {
        Hashtag hashtag = hashtagService.findOrCreateHashtag(hashtagRequest.getName());
        return ResponseEntity.ok(hashtag);
    }

    @GetMapping("/{hashtagName}/posts")
    public ResponseEntity<List<PostVM>> getPostsByHashtag(@PathVariable String hashtagName) {
        List<PostVM> posts = hashtagService.getPostsByHashtag(hashtagName);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{hashtagName}/post-count")
    public ResponseEntity<?> getHashtagPostCount(@PathVariable String hashtagName) {
        int postCount = hashtagService.getHashtagPostCount(hashtagName);
        return ResponseEntity.ok(postCount);
    }

    @GetMapping("/trends")
    public List<Hashtag> getTopHashtags() {
        return hashtagService.getTopHashtags();
    }

}
