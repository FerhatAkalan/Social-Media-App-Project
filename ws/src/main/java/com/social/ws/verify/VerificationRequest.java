package com.social.ws.verify;

import com.social.ws.user.User;
import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "verification_requests")
public class VerificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1024)
    private String reason;

    @Column(name = "attachment_name")
    private String attachment;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Diğer gerekli alanlar ve getter/setter'lar...
}
