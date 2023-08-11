package com.social.ws.verify;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonBackReference
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    @Column(length = 1024)
    private String reason;
    @Column(name = "attachment_name")
    private String attachment;
}