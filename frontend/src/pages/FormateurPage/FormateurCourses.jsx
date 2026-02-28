import React, { useState, useEffect } from 'react';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';

const FormateurCourses = () => {
  const { i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState('mycourses');
  const navigate = useNavigate();
  const location = useLocation();

  // sync active menu for navigation highlights
  useEffect(() => {
    if (location.pathname.includes('/profile')) {
      setActiveMenu('profile');
    } else if (location.pathname.includes('/dashboard')) {
      setActiveMenu('dashboard');
    } else if (location.pathname.includes('/courses')) {
      setActiveMenu('mycourses');
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

  // sample course data
  const courses = [
    {
      id: 1,
      title: 'Information About UI/UX Design & Degree',
      image: 'https://via.placeholder.com/120x80',
      price: '$200',
      lessons: '12',
      duration: '30min',
      status: 'Published',
    },
    {
      id: 2,
      title: 'Wordpress for Beginners – Master Webpages Quickly',
      image: 'https://via.placeholder.com/120x80',
      price: '$150',
      lessons: '10',
      duration: '45min',
      status: 'Published',
    },
    {
      id: 3,
      title: 'Sketch From A to Z (2022): Become an app designer',
      image: 'https://via.placeholder.com/120x80',
      price: 'Free',
      lessons: '8',
      duration: '20min',
      status: 'Draft',
    },
    {
      id: 4,
      title: 'Learn Angular Fundamental From beginning to adv',
      image: 'https://via.placeholder.com/120x80',
      price: '$145',
      lessons: '12',
      duration: '30min',
      status: 'Pending',
    },
    {
      id: 5,
      title: 'C# Developers Double Your Coding Speed',
      image: 'https://via.placeholder.com/120x80',
      price: '$120',
      lessons: '12',
      duration: '30min',
      status: 'Inactive',
    },
    {
      id: 6,
      title: 'Build Responsive Real World Websites',
      image: 'https://via.placeholder.com/120x80',
      price: '$200',
      lessons: '10',
      duration: '30min',
      status: 'Published',
    },
  ];

  const [statusFilter, setStatusFilter] = useState('Published');

  const statusOptions = [
    { label: 'Published', key: 'Published' },
    { label: 'Pending', key: 'Pending' },
    { label: 'Draft', key: 'Draft' },
    { label: 'Inactive', key: 'Inactive' },
    { label: 'All', key: 'All' },
  ];

  const filteredCourses = courses.filter(c => statusFilter === 'All' || c.status === statusFilter);

  return (
    <div className="formateur-page">
      {/* Navbar */}
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>

          <div className="navbar-dashboard-center">
            <h1>Courses</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/Courses</span>
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
          {/* profile section with add course button */}
          <ProfilSection/>
          {/* status filters */}
          <div className="status-filters">
            {statusOptions.map((opt) => (
              <button
                key={opt.key}
                className={statusFilter === opt.key ? 'active' : ''}
                onClick={() => setStatusFilter(opt.key)}
              >
                {opt.label} {opt.key !== 'All' ? `(${courses.filter(c => c.status === opt.key).length})` : `(${courses.length})`}
              </button>
            ))}
          </div>

          <div className="courses-section">
            <div className="courses-table">
              <div className="table-header">
                <div className="col-title">Course</div>
                <div className="col-students">Lessons</div>
                <div className="col-status">Status</div>
              </div>
              {filteredCourses.map((course) => (
                <div key={course.id} className="table-row">
                  <div className="col-title">
                    <img src={course.image} alt={course.title} className="course-thumbnail" />
                    <span>{course.title}</span>
                  </div>
                  <div className="col-students">{course.lessons}</div>
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

export default FormateurCourses;
