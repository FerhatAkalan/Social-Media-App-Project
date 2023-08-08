package com.social.ws.user.vm;

import com.social.ws.user.User;
import lombok.Data;

@Data
public class UserVM {
    private String username;

    private String displayName;

    private String image;
    private boolean isAdmin;

    public UserVM(User user) {
        this.setUsername(user.getUsername());
        this.setDisplayName(user.getDisplayName());
        this.setImage(user.getImage());
        this.setAdmin(user.isAdmin());
    }
}
