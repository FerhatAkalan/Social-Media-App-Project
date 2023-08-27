import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import tr from "../assets/32_1.png"
import en from "../assets/32.png"


const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [i18nData, setI18nData] = useState([]);

  useEffect(() => {
    fetchI18nData();
  }, []);

  const fetchI18nData = async () => {
    try {
      const response = await axios.get("/api/i18n");
      setI18nData(response.data);
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  };

  const onChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    updateI18nResources(language);
  };

  const updateI18nResources = (language) => {
    const translations = {};
    i18nData.forEach((item) => {
      if (item.language === language) {
        translations[item.keyword] = item.text;
      }
    });
    i18n.addResourceBundle(language, "translations", translations, true, true);
  };

  return (
    <div className="">
      <div className="d-flex flex-row-reverse">
        <img
          src={en}
          alt="USA Flag"
          onClick={() => onChangeLanguage("en")}
          style={{ cursor: "pointer" }}
        />
        <img
          src={tr}
          alt="Turkish Flag"
          onClick={() => onChangeLanguage("tr")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default LanguageSelector;
