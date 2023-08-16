package com.social.ws.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "social")
public class AppConfiguration {

    private String uploadPath;
    private String profileStorage = "profile";

    private String attachmentStorage = "attachment";
    private String verifiedStorage = "verified";

    public String getProfileStorePath() {
        return uploadPath + "/" + profileStorage;
    }

    public String getAttachmentStorePath() {
        return uploadPath + "/" + attachmentStorage;
    }

    public String getVerifiedStorage() {
        return uploadPath + "/" + verifiedStorage;
    }

}
