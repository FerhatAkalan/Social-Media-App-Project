package com.social.ws.auth;

import com.social.ws.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Token {
    @Id
    private String token;
    @ManyToOne
    private User user;
}
