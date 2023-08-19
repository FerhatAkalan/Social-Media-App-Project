package com.social.ws.post;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.social.ws.file.FileAttachment;
import com.social.ws.like.Like;
import com.social.ws.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(length = 1000)
    private String content;
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @ManyToOne
    private User user;

    @OneToOne(mappedBy = "post", cascade = CascadeType.REMOVE)
    private FileAttachment fileAttachment;

    @JsonManagedReference
    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE)
    private List<Like> likes;


}
