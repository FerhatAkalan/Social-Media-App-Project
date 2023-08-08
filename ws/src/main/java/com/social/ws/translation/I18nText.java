package com.social.ws.translation;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "i18n_texts")
public class I18nText {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keyword;
    private String language;
    private String text;

    // Getters and setters
}

