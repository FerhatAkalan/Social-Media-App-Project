package com.social.ws.file;

import com.social.ws.post.Post;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class FileAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String fileType;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    @OneToOne
    private Post post;

}
