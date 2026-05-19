import React from 'react';
import { useTranslation } from 'react-i18next';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import '../../pages/ApprenantPage/apprenant.css';
import { FaBars } from 'react-icons/fa';
import 'flag-icons/css/flag-icons.min.css';

const DashboardNavbar = ({ onMenuClick }) => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language || 'en';

  const changeLanguage = () => {
    i18n.changeLanguage(currentLang === 'en' ? 'fr' : 'en');
  };

  const getFlagClass = (lang) => {
    return lang === 'fr' ? 'fi fi-fr' : 'fi fi-us';
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">

        <div className="header-left">
          <button 
            className="mobile-menu-btn" 
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
          <img
            src={logo_rem}
            alt="ForsaLearn"
            className="navbar-dashboard-logo"
          />
        </div>

        <div className="navbar-dashboard-right">
          <button
            className="lang-btn"
            onClick={changeLanguage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span
              className={getFlagClass(currentLang)}
              style={{ fontSize: '18px' }}
            ></span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default DashboardNavbar;