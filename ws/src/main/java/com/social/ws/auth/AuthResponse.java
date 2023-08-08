package com.social.ws.auth;

import com.social.ws.user.vm.UserVM;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private UserVM user;
}
