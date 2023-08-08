package com.social.ws;

import com.social.ws.post.PostService;
import com.social.ws.post.vm.PostSubmitVM;
import com.social.ws.user.User;
import com.social.ws.user.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

@SpringBootApplication
public class WsApplication {

    public static void main(String[] args) {
        SpringApplication.run(WsApplication.class, args);
    }

    @Bean
    @Profile("dev")
    CommandLineRunner createInitialUsers(UserService userService, PostService postService) {
        return (args) -> {
            try {
                userService.getByUsername("user1");
                userService.getByUsername("ferhatakalan");

            } catch (Exception e) {
                User adminUser = new User();
                adminUser.setUsername("ferhatakalan");
                adminUser.setDisplayName("Ferhat Akalan");
                adminUser.setPassword("Ferhat123+");
                adminUser.setAdmin(true); // isAdmin alanı true olarak ayarlandı
                userService.save(adminUser);
                for (int i = 1; i <= 25; i++) {
                    User user = new User();
                    user.setUsername("user" + i);
                    user.setDisplayName("Display Name " + i);
                    user.setPassword("P4ssword");
                    userService.save(user);
                    for (int j = 1; j <= 10; j++) {
                        PostSubmitVM post = new PostSubmitVM();
                        post.setContent("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Post: " + j + " from user " + i);
                        postService.save(post, user);
                    }
                }
            }
        };
    }
}
