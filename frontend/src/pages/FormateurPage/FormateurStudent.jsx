import React, { useState, useEffect } from 'react';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';

const FormateurStudent = () => {
  const { i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState('students');
  const navigate = useNavigate();
  const location = useLocation();

  // sync active menu based on path
  useEffect(() => {
    if (location.pathname.includes('/profile')) {
      setActiveMenu('profile');
    } else if (location.pathname.includes('/dashboard')) {
      setActiveMenu('dashboard');
    } else if (location.pathname.includes('/courses')) {
      setActiveMenu('mycourses');
    } else if (location.pathname.includes('/students')) {
      setActiveMenu('students');
    }
  }, [location.pathname]);

  const changeLanguage = () => {
    const lang = (i18n && i18n.language === 'en') ? 'fr' : 'en';
    const instance = (i18n && typeof i18n.changeLanguage === 'function') ? i18n : i18nInstance;
    if (instance && typeof instance.changeLanguage === 'function') {
      instance.changeLanguage(lang);
    }
  };

  const getFlagClass = (lang) => {
    switch (lang) {
      case 'en':
        return 'fi fi-gb';
      case 'fr':
        return 'fi fi-fr';
      default:
        return 'fi fi-gl';
    }
  };

  const currentLang = (i18n && i18n.language) ? i18n.language : 'en';

  const students = [
    { id: 1, name: 'Ronald Richard', avatar: 'https://via.placeholder.com/120', join: '22 Aug 2025', courses: 10 },
    { id: 2, name: 'Mona Nancy', avatar: 'https://via.placeholder.com/120', join: '15 Jul 2025', courses: 8 },
    { id: 3, name: 'Patrick Alleman', avatar: 'https://via.placeholder.com/120', join: '18 Jan 2025', courses: 12 },
    { id: 4, name: 'Olive Paxson', avatar: 'https://via.placeholder.com/120', join: '03 May 2025', courses: 7 },
    { id: 5, name: 'Chris Thomas', avatar: 'https://via.placeholder.com/120', join: '14 Apr 2025', courses: 4 },
    { id: 6, name: 'Joyce Perron', avatar: 'https://via.placeholder.com/120', join: '17 Mar 2025', courses: 11 },
  ];

  return (
    <div className="formateur-page">
      {/* Navbar */}
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>

          <div className="navbar-dashboard-center">
            <h1>Students</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/Students</span>
          </div>

          <div className="navbar-dashboard-right">
            <button className="lang-btn-dashboard" onClick={changeLanguage}>
              <span className={getFlagClass(currentLang)} style={{ fontSize: '20px' }}></span>
              <span>{currentLang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="formateur-container">
        {/* Sidebar */}
        <SidebarF activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

        {/* Main Content */}
        <main className="formateur-main">
          <ProfilSection />

          <div className="students-toolbar">
            <input type="text" placeholder="Search" className="search-input" />
            {/* view toggle buttons could go here */}
          </div>

          <div className="students-grid">
            {students.map((st) => (
              <div key={st.id} className="student-card">
                <img src={st.avatar} alt={st.name} />
                <div className="student-role">Active Student</div>
                <h3>{st.name}</h3>
                <p className="join-date">Joined {st.join}</p>
                <div className="courses-info">
                  📚 {st.courses} Courses
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormateurStudent;
