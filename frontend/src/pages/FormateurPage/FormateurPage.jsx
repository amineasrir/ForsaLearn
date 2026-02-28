import React, { useState } from 'react';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';


const FormateurPage = () => {
  const { i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const changeLanguage = () => {
    const lang = (i18n && i18n.language === "en") ? "fr" : "en";
    const instance = (i18n && typeof i18n.changeLanguage === "function") ? i18n : i18nInstance;
    if (instance && typeof instance.changeLanguage === "function") {
      instance.changeLanguage(lang);
    }
  };

  const getFlagClass = (lang) => {
    switch (lang) {
      case "en":
        return "fi fi-gb";
      case "fr":
        return "fi fi-fr";
      default:
        return "fi fi-gl";
    }
  };

  const currentLang = (i18n && i18n.language) ? i18n.language : "en";

  // Données d'exemple
  const formateur = {
    name: 'khadija Essir',
    avatar: 'https://via.placeholder.com/60',
    totalCourses: 12,
    totalStudents: 485,
    totalRevenue: '$4,890',
  };

  const stats = [
    { icon: '📚', label: 'Total Courses', value: '12', color: '#FF6B9D' },
    { icon: '👥', label: 'Students Enrolled', value: '485', color: '#4F46E5' },
    { icon: '💰', label: 'Total Revenue', value: '$4,890', color: '#10B981' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Complete HTML, CSS and JavaScript',
      image: 'https://via.placeholder.com/80',
      students: 5,
      status: 'Published',
    },
    {
      id: 2,
      title: 'Complete Course on Machine Web',
      image: 'https://via.placeholder.com/80',
      students: 3,
      status: 'Published',
    },
    {
      id: 3,
      title: 'Web Development and Deployment',
      image: 'https://via.placeholder.com/80',
      students: 8,
      status: 'Published',
    },
    {
      id: 4,
      title: 'Python Introduction and OOP Design Beginners',
      image: 'https://via.placeholder.com/80',
      students: 1,
      status: 'Published',
    },
    {
      id: 5,
      title: 'Information About EXAM Design Logic',
      image: 'https://via.placeholder.com/80',
      students: 12,
      status: 'Published',
    },
  ];

  const earningsData = [75, 80, 65, 90, 70, 85, 75, 88, 72, 80, 78, 85];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'mycourses', label: 'My Courses', icon: '📚' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'Quiz', label: 'Quiz', icon: '❓' },
    { id: 'Quiz Results', label: 'Quiz Results', icon: '📊' },
    { id: 'Certificates', label: 'Certificates', icon: '📜' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    {id: 'support', label: 'Support', icon: '❓' },
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
            <h1>Dashboard</h1>
            <a href="/">Home</a>
            <span style={{color:"#6b7280"}}>/Dashboard</span>
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
        <aside className="formateur-sidebar">
          <div className="sidebar-section">
            <h3>View Menu</h3>
            <ul className="menu-list">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                    onClick={() => setActiveMenu(item.id)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-section account-settings">
            <h3>Account Settings</h3>
            <ul className="menu-list">
              <li>
                <button className="menu-item">
                  <span className="menu-icon">⚙️</span>
                  <span className="menu-label">Setting</span>
                </button>
              </li>
              <li>
                <button className="menu-item">
                  <span className="menu-icon">🚪</span>
                  <span className="menu-label">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="formateur-main">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-content">
              <img src={formateur.avatar} alt="Profile" className="profile-avatar" />
              <div className="profile-info">
                <h1>{formateur.name}</h1>
                <span className="instructor-badge">Instructor</span>
              </div>
            </div>
            <button className="add-course-btn">Add New Course</button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                <div className="stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <p className="stat-label">{stat.label}</p>
                  <h2 className="stat-value">{stat.value}</h2>
                </div>
              </div>
            ))}
          </div>

          {/* Earnings Chart */}
          <div className="earnings-section">
            <h2>Earnings by Year</h2>
            <div className="chart-container">
              <div className="chart">
                {earningsData.map((value, index) => (
                  <div key={index} className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{ height: `${(value / 100) * 100}%` }}
                    >
                      <div className="bar-segment" style={{ backgroundColor: '#4F46E5', height: '50%' }}></div>
                      <div className="bar-segment" style={{ backgroundColor: '#FF6B9D', height: '50%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span>Jan 2025 - Dec 2025</span>
              </div>
            </div>
          </div>

          {/* Recently Created Courses */}
          <div className="courses-section">
            <h2>Recently Created Courses</h2>
            <div className="courses-table">
              <div className="table-header">
                <div className="col-title">Course</div>
                <div className="col-students">Students</div>
                <div className="col-status">Status</div>
              </div>
              {courses.map((course) => (
                <div key={course.id} className="table-row">
                  <div className="col-title">
                    <img src={course.image} alt={course.title} className="course-thumbnail" />
                    <span>{course.title}</span>
                  </div>
                  <div className="col-students">{course.students}</div>
                  <div className="col-status">
                    <span className="status-badge">{course.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormateurPage;
