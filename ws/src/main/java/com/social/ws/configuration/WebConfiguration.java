package com.social.ws.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.util.concurrent.TimeUnit;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Autowired
    AppConfiguration appConfiguration;


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:./" + appConfiguration.getUploadPath() + "/")
                .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
    }

    @Bean
    @Profile("dev")
    CommandLineRunner createStorageDirectories() {
        return (args) -> {
            createFolder(appConfiguration.getUploadPath());
            createFolder(appConfiguration.getProfileStorePath());
            createFolder(appConfiguration.getAttachmentStorePath());
            createFolder(appConfiguration.getVerifyStorage());
        };
    }

    private void createFolder(String path) {
        File folder = new File(path);
        boolean folderExist = folder.exists();
        if (!folderExist) {
            folder.mkdir();
        }
    }

}
