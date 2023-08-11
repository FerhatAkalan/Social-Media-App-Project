package com.social.ws.user.vm;

import com.social.ws.user.User;
import lombok.Data;

@Data
public class UserVM {
    private long id;
    private String username;

    private String displayName;

    private String image;
    private boolean isAdmin;
    private boolean isVerified;

    public UserVM(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setDisplayName(user.getDisplayName());
        this.setImage(user.getImage());
        this.setAdmin(user.isAdmin());
        this.setVerified(user.isVerified());
    }
}
