import React, { useState } from 'react'
import { FaChartBar, FaUser, FaBook, FaUsers, FaPlus, FaQuestionCircle, FaClipboardList, FaTrophy, FaDollarSign, FaEnvelope, FaHeadset, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearUserSession } from '../../utils/authStorage';
import '../../styles/formateur.css';  

const SidebarF = ({ activeMenu: propActive, setActiveMenu: propSetActive }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalActive, setInternalActive] = useState('dashboard');

  const handleLogout = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    if (token) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      navigate('/signin');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar, path: '/formateur/dashboard' },
    { id: 'profile', label: 'Profile', icon: FaUser, path: '/formateur/profile' },
    { id: 'mycourses', label: 'My Courses', icon: FaBook, path: '/formateur/courses' },
    { id: 'addcourse', label: 'Add Course', icon: FaPlus, path: '/formateur/add-course' },
    { id: 'students', label: 'Students', icon: FaUsers, path: '/formateur/students' },
    { id: 'quizResults', label: 'Quiz Results', icon: FaClipboardList, path: '/formateur/quiz-results' },
    { id: 'certificates', label: 'Certificates', icon: FaTrophy, path: '/formateur/certificates' },
    { id: 'earnings', label: 'Earnings', icon: FaDollarSign, path: '/formateur/earnings' },
    { id: 'messages', label: 'Messages', icon: FaEnvelope, path: '/formateur/messages' },
    { id: 'support', label: 'Support', icon: FaHeadset, path: '/formateur/support' },
  ];

  const computeActive = () => {
    if (propActive !== undefined) return propActive;
    const path = location.pathname || '';
    const matched = menuItems.find(item => item.path && path.startsWith(item.path));
    if (matched) return matched.id;
    return internalActive;
  };

  const activeMenu = computeActive();
  const setActiveMenu = propSetActive !== undefined ? propSetActive : setInternalActive;

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
                      <button 
                        className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
                        onClick={() => {
                          setActiveMenu('settings');
                          navigate('/formateur/settings');
                        }}
                      >
                        <span className="menu-icon"><FaCog /></span>
                        <span className="menu-label">Setting</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        className="menu-item"
                        onClick={handleLogout}
                      >
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
