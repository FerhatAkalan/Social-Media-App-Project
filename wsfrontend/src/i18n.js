import React, {  useEffect } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { register } from "timeago.js";
import { fetchTranslationFromAPI } from "../src/api/apiCalls"; 

i18n.use(initReactI18next).init({
  resources: {}, 
  fallbackLng: "en",
  ns: ["translations"],
  defaultNS: "translations",
  keySeperator: false,
  interpolation: {
    escapeValue: false,
    formatSeperator: ",",
  },
  react: {
    wait: true,
  },
});

const timeagoTR = (number, index) => {
  return [
    ["az önce", "şimdi"],
    ["%s saniye önce", "%s saniye içinde"],
    ["1 dakika önce", "1 dakika içinde"],
    ["%s dakika önce", "%s dakika içinde"],
    ["1 saat önce", "1 saat içinde"],
    ["%s saat önce", "%s saat içinde"],
    ["1 gün önce", "1 gün içinde"],
    ["%s gün önce", "%s gün içinde"],
    ["1 hafta önce", "1 hafta içinde"],
    ["%s hafta önce", "%s hafta içinde"],
    ["1 ay önce", "1 ay içinde"],
    ["%s ay önce", "%s ay içinde"],
    ["1 yıl önce", "1 yıl içinde"],
    ["%s yıl önce", "%s yıl içinde"],
  ][index];
};

register("tr", timeagoTR);
function I18nProvider() {
  useEffect(() => {
    loadTranslations("en");
  }, []);

  async function loadTranslations(language) {
    const translations = await fetchTranslationFromAPI(language);
    i18n.addResourceBundle(language, "translations", translations, true, true);
  }

}

export default I18nProvider;
