import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaUser, FaBook, FaTrophy, FaHeart,
  FaClipboardList, FaHistory, FaEnvelope, FaHeadset,
  FaCog, FaSignOutAlt, FaTimes,
} from 'react-icons/fa';
import '../../pages/ApprenantPage/dashboard.css';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    if (token) { 
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/signin';
    }
  };

  const makeItem = (to, icon, text) => (
    <Link 
      to={to}
      className={`apprenant-menu-item${path === to ? ' active' : ''}`}
    >
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{text}</span>
    </Link>
  );

  return (
    <div>
      <aside className={`apprenant-sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-header mobile-only">
          <button type="button" className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-content">
          <h3 className="apprenant-menu-title">{t('apprenant.mainMenu')}</h3>
          <nav className="apprenant-menu">
            {makeItem('/apprenant/dashboard', <FaHome />, t('apprenant.dashboard'))}
            {makeItem('/apprenant/profile', <FaUser />, t('apprenant.myProfile'))}
            {makeItem('/apprenant/enrolled', <FaBook />, t('apprenant.enrolledCourses'))}
            {makeItem('/apprenant/courses', <FaBook />, t('apprenant.courses'))}
            {makeItem('/apprenant/certificates', <FaTrophy />, t('apprenant.myCertificates'))}
            {makeItem('/apprenant/wishlist', <FaHeart />, t('apprenant.wishlist'))}
            {makeItem('/apprenant/quizzes', <FaClipboardList />, t('apprenant.myQuizAttempts'))}
            {makeItem('/apprenant/messages', <FaEnvelope />, t('apprenant.messages'))}
            {makeItem('/apprenant/support', <FaHeadset />, t('apprenant.supportTickets'))}
          </nav>

          <h3 className="menu-title">{t('apprenant.accountSettings')}</h3>
          <nav className="menu">
            {makeItem('/apprenant/settings', <FaCog />, t('apprenant.settings'))}
            <button className="menu-item" onClick={handleLogout}>
              <span className="menu-icon"><FaSignOutAlt /></span>
              <span className="menu-text">{t('apprenant.logout')}</span>
            </button>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar
