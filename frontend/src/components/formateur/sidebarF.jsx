import React, { useState } from 'react'
import { FaChartBar, FaUser, FaBook, FaUsers, FaQuestionCircle, FaClipboardList, FaTrophy, FaDollarSign, FaEnvelope, FaHeadset, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/formateur.css';  

const SidebarF = ({ activeMenu: propActive, setActiveMenu: propSetActive }) => {
  const navigate = useNavigate();
  const [internalActive, setInternalActive] = useState('dashboard');
  const activeMenu = propActive !== undefined ? propActive : internalActive;
  const setActiveMenu = propSetActive !== undefined ? propSetActive : setInternalActive;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar, path: '/formateur/dashboard' },
    { id: 'profile', label: 'Profile', icon: FaUser, path: '/formateur/profile' },
    { id: 'mycourses', label: 'My Courses', icon: FaBook, path: '/formateur/courses' },
    { id: 'students', label: 'Students', icon: FaUsers, path: '/formateur/students' },
    { id: 'quiz', label: 'Quiz', icon: FaQuestionCircle },
    { id: 'quizResults', label: 'Quiz Results', icon: FaClipboardList },
    { id: 'certificates', label: 'Certificates', icon: FaTrophy },
    { id: 'earnings', label: 'Earnings', icon: FaDollarSign },
    { id: 'messages', label: 'Messages', icon: FaEnvelope },
    { id: 'support', label: 'Support', icon: FaHeadset },
  ];

  return (
    <div>
        <aside className="formateur-sidebar">
                <div className="sidebar-section">
                  <h3>View Menu</h3>
                  <ul className="menu-list">
                    {menuItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <li key={item.id}>
                          <button
                            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                            onClick={() => {
                              setActiveMenu(item.id);
                              if (item.path) navigate(item.path);
                            }}
                          >
                            <span className="menu-icon"><IconComponent /></span>
                            <span className="menu-label">{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
      
                <div className="sidebar-section account-settings">
                  <h3>Account Settings</h3>
                  <ul className="menu-list">
                    <li>
                      <button className="menu-item">
                        <span className="menu-icon"><FaCog /></span>
                        <span className="menu-label">Setting</span>
                      </button>
                    </li>
                    <li>
                      <button className="menu-item">
                        <span className="menu-icon"><FaSignOutAlt /></span>
                        <span className="menu-label">Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </aside>
    </div>
  )
}

export default SidebarF 
