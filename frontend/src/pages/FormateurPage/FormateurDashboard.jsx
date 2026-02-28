import React, { useState, useEffect } from 'react';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import EarningsChart from '../../components/charts/EarningsChart';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import { FaChartBar, FaUser, FaBook, FaUsers, FaQuestionCircle, FaClipboardList, FaTrophy, FaDollarSign, FaEnvelope, FaHeadset, FaCog, FaSignOutAlt } from 'react-icons/fa';





const FormateurPage = () => {
  const { i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  // sync active menu with the current path
  useEffect(() => {
    if (location.pathname.includes('/profile')) {
      setActiveMenu('profile');
    } else if (location.pathname.includes('/courses')) {
      setActiveMenu('mycourses');
    } else if (location.pathname.includes('/students')) {
      setActiveMenu('students');
    } else {
      setActiveMenu('dashboard');
    }
  }, [location.pathname]);

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
        <SidebarF />
        {/* Main Content */}
        <main className="formateur-main">
          {/* Profile Section */}
          <ProfilSection />

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
            {/* the custom bar chart replaced by a Recharts line chart component */}
            <EarningsChart />
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
