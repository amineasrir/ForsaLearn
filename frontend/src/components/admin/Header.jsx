import React from 'react'
import { useTranslation } from "react-i18next";
import i18nInstance from "../../i18n";
import "flag-icons/css/flag-icons.min.css"; // Import CSS des drapeaux
import logo from "../../assets/image/home_page/logo_rem.png";

const Header = ({title}) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = () => {
      const lang = i18n && i18n.language === "en" ? "fr" : "en";
      const instance =
        i18n && typeof i18n.changeLanguage === "function" ? i18n : i18nInstance;
      if (instance && typeof instance.changeLanguage === "function") {
        instance.changeLanguage(lang);
      } else {
        console.warn("i18n.changeLanguage is not available");
      }
    };
  

      // Fonction pour obtenir le code du drapeau
      const getFlagClass = (lang) => {
        switch (lang) {
          case "en":
            return "fi fi-gb"; // Royaume-Uni pour anglais
          case "fr":
            return "fi fi-fr"; // France pour français
          default:
            return "fi fi-gl"; // globe par défaut
        }
      };
    
      // Ensure we have a valid language string before calling string methods
      const currentLang = i18n && i18n.language ? i18n.language : "en";
  return (
    <div className="hero">
            <div className="container">
              <div className="logo">
                <img src={logo} alt="ForsaLearn Logo" className="logo-icon" />
              </div>
    
              <h1 className="hero-title">{title}</h1>
              <div className="nav-actions">
                <button
                  className="lang-btn"
                  onClick={changeLanguage}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    className={getFlagClass(currentLang)}
                    style={{ fontSize: "18px" }}
                  ></span>
                  <span>{currentLang.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>
  )
}

export default Header
