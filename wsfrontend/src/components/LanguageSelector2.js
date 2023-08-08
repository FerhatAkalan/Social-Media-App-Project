import React from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../api/apiCalls";

const LanguageSelector = (props) => {
  const{i18n} = useTranslation();


  const onChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    changeLanguage(language);
  };
  return (
    <div className="">
      <div className="d-flex flex-row-reverse">
        <img
          src="https://flagsapi.com/US/flat/32.png"
          alt="USA Flag"
          onClick={() => onChangeLanguage("en")}
          style={{ cursor: "pointer" }}
        />
        <img
          src="https://flagsapi.com/TR/flat/32.png"
          alt="Turkish Flag"
          onClick={() => onChangeLanguage("tr")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default LanguageSelector;
