import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaUser, FaBook, FaEnvelope, FaHeadset,
  FaCog, FaSignOutAlt, FaBookReader, FaUserTie 
} from 'react-icons/fa';
import '../../styles/sidebar-admin.css';

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

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
      <aside className="apprenant-sidebar">
        <div className="sidebar-content">
          <h3 className="apprenant-menu-title">Main Menu</h3>
          <nav className="apprenant-menu">
            {makeItem('/admin/', <FaHome />, 'Dashboard')}
            {makeItem('/admin/profile', <FaUser />, 'My Profile')}
            {makeItem('/admin/courses', <FaBook />, 'Courses')}
            {makeItem('/admin/instructors', <FaUserTie  />, 'Instructors')} 
            {makeItem('/admin/students', <FaBookReader />, 'Students')}
            {makeItem('/admin/conversations', <FaEnvelope />, 'Conversations')}
            {makeItem('/admin/support', <FaHeadset />, 'Support Tickets')}
          </nav>

          <h3 className="apprenant-menu-title">Account Settings</h3>
          <nav className="menu">
            {makeItem('/admin/settings', <FaCog />, 'Settings')}
            {makeItem('/admin/logout', <FaSignOutAlt />, 'Logout')}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar
