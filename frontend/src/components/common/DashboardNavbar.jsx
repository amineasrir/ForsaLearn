import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars } from 'react-icons/fa';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import '../../pages/ApprenantPage/dashboard.css';
import 'flag-icons/css/flag-icons.min.css'; // Import CSS des drapeaux

/**
 * Props:
 * - title: page title string
 * - breadcrumb: array of { to?, label } objects; the last item may omit 'to'
 * - rightContent: optional React node to render inside right section (e.g. icons)
 * - onMenuClick: optional callback to open the mobile sidebar
 */
const DashboardNavbar = ({ title, breadcrumb = [], rightContent = null, onMenuClick = null }) => {
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
          {onMenuClick && (
            <button type="button" className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
              <FaBars />
            </button>
          )}
          <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
        </div>
        <div className="header-center">
          <h1>{title}</h1>
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="breadcrumb">
              {breadcrumb.map((item, idx) => (
                <React.Fragment key={idx}>
                  {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
                  {idx < breadcrumb.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        <div className="navbar-dashboard-right">
          {rightContent}
           <button className="lang-btn" onClick={changeLanguage} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className={getFlagClass(currentLang)} style={{ fontSize: '18px' }}></span>
          <span>{currentLang.toUpperCase()}</span>
        </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
