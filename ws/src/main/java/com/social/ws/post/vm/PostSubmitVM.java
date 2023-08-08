package com.social.ws.post.vm;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PostSubmitVM {

    @Size(min = 1, max = 1000)
    private String content;

    private long attachmentId;
}
