package com.social.ws.translation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/i18n")
public class I18nTextController {

    @Autowired
    private I18nTextRepository i18nTextRepository;

    @GetMapping
    public ResponseEntity<List<I18nText>> getAllI18nTexts() {
        List<I18nText> i18nTexts = i18nTextRepository.findAll();
        return ResponseEntity.ok(i18nTexts);
    }
}

