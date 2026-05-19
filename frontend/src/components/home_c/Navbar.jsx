import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import i18nInstance from "../../i18n";
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import 'flag-icons/css/flag-icons.min.css'; // Import CSS des drapeaux

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const lang = (i18n && i18n.language === "en") ? "fr" : "en";
    const instance = (i18n && typeof i18n.changeLanguage === "function") ? i18n : i18nInstance;
    if (instance && typeof instance.changeLanguage === "function") {
      instance.changeLanguage(lang);
    } else {
      console.warn("i18n.changeLanguage is not available");
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
  const currentLang = (i18n && i18n.language) ? i18n.language : "en";

  return (
    <nav className="navbar">
      <img className="logo" src={logo_rem} alt="Logo" />

      <ul className="nav-links">
        <li><button onClick={() => scrollToSection('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>{t("home")}</button></li>
        <li><button onClick={() => scrollToSection('courses')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>{t("courses")}</button></li>
        <li><button onClick={() => scrollToSection('blog')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>{t("blog")}</button></li>
        <li><button onClick={() => scrollToSection('footer')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>{t("contact")}</button></li>
      </ul>



      <div className="nav-actions">
        <button className="lang-btn-h" onClick={changeLanguage} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className={getFlagClass(currentLang)} style={{ fontSize: '18px' }}></span>
          <span>{currentLang.toUpperCase()}</span>
        </button>

        <Link to="/signin">
          <button className="btn-outline">{t("login")}</button>
        </Link>
        <Link to="/signup">
          <button className="btn-primary">{t("register")}</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
