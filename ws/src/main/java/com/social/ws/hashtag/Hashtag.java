package com.social.ws.hashtag;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.social.ws.post.Post;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "hashtags")
public class Hashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
    @JsonBackReference
    @ManyToMany(mappedBy = "hashtags")
    private List<Post> posts = new ArrayList<>();

    private int postCount;


}
