package com.social.ws.verify.vm;

import lombok.Data;

@Data
public class VerificationRequestDTO {
    private Long id;
    private Long userId;
    private String username;
    private boolean isVerified;
    private String reason;
    private String attachment;
}
