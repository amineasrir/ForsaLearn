import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaUser, FaBook, FaTrophy, FaHeart,
  FaClipboardList, FaHistory, FaEnvelope, FaHeadset,
  FaCog, FaSignOutAlt, 
} from 'react-icons/fa';
import '../../pages/ApprenantPage/dashboard.css';

const Sidebar = () => {
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
      <aside className="apprenant-sidebar" style={{marginTop:"48px"}}>
        <div className="sidebar-content">
          <h3 className="apprenant-menu-title">Main Menu</h3>
          <nav className="apprenant-menu">
            {makeItem('/apprenant/dashboard', <FaHome />, 'Dashboard')}
            {makeItem('/apprenant/profile', <FaUser />, 'My Profile')}
            {makeItem('/apprenant/enrolled', <FaBook />, 'Enrolled Courses')}
            {makeItem('/apprenant/courses', <FaBook />, 'Courses')}
            {makeItem('/apprenant/certificates', <FaTrophy />, 'My Certificates')}
            {makeItem('/apprenant/wishlist', <FaHeart />, 'Wishlist')}
            {makeItem('/apprenant/quizzes', <FaClipboardList />, 'My Quiz Attempts')}
            {makeItem('/apprenant/orders', <FaHistory />, 'Order History')}
            {makeItem('/apprenant/messages', <FaEnvelope />, 'Messages')}
            {makeItem('/apprenant/support', <FaHeadset />, 'Support Tickets')}
          </nav>

          <h3 className="menu-title">Account Settings</h3>
          <nav className="menu">
            {makeItem('/apprenant/settings', <FaCog />, 'Settings')}
            <button className="menu-item" onClick={handleLogout}>
              <span className="menu-icon"><FaSignOutAlt /></span>
              <span className="menu-text">Logout</span>
            </button>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar
