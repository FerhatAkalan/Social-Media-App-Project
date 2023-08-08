package com.social.ws.translation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface I18nTextRepository extends JpaRepository<I18nText, Long> {

    List<I18nText> findByKeywordAndLanguage(String keyword, String language);

    List<I18nText> findAllByLanguage(String language);
}
