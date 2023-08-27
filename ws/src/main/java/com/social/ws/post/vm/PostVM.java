package com.social.ws.post.vm;


import com.social.ws.file.vm.FileAttachmentVM;
import com.social.ws.hashtag.Hashtag;
import com.social.ws.post.Post;
import com.social.ws.user.vm.UserVM;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class PostVM {

    private long id;

    private String content;

    private long timestamp;

    private UserVM user;

    private FileAttachmentVM fileAttachment;

    private List<String> hashtags;

    public PostVM(Post post) {
        this.setId(post.getId());
        this.setContent(post.getContent());
        this.setTimestamp(post.getTimestamp().getTime());
        this.setUser(new UserVM(post.getUser()));
        if (post.getFileAttachment() != null) {
            this.fileAttachment = new FileAttachmentVM(post.getFileAttachment());
        }
        if (post.getHashtags() != null) {
            this.hashtags = post.getHashtags().stream()
                    .map(Hashtag::getName)
                    .collect(Collectors.toList());
        }
    }
}
