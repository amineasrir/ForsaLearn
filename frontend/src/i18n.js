import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        home: "Home",
        courses: "Courses",
        login: "Login"
      }
    },
    fr: {
      translation: {
        home: "Accueil",
        courses: "Formations",
        login: "Connexion"
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;