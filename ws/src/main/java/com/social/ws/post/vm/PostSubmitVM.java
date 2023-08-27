package com.social.ws.post.vm;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class PostSubmitVM {

    @Size(min = 1, max = 1000)
    private String content;

    private long attachmentId;
    
    private List<String> hashtags;
}
