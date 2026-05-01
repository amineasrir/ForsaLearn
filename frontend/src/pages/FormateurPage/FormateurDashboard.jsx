import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import EarningsChart from '../../components/charts/EarningsChart';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import {
  getFormateurDashboardStats,
  getFormateurProfile
} from '../../services/formateurService';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value || 0);
};

const FormateurDashboard = () => {
  const { i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [profileResponse, statsResponse] = await Promise.all([
          getFormateurProfile(),
          getFormateurDashboardStats()
        ]);

        setProfile(profileResponse.data?.data || null);
        setStats(statsResponse.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

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

  const overview = stats?.overview || {};
  const topCourses = stats?.topCourses || [];

  const cards = useMemo(() => ([
    {
      icon: '📚',
      label: 'Total Courses',
      value: overview.totalCourses || 0,
      color: '#FF6B9D'
    },
    {
      icon: '👥',
      label: 'Students Enrolled',
      value: overview.totalEnrollments || 0,
      color: '#4F46E5'
    },
    {
      icon: '💰',
      label: 'Total Revenue',
      value: formatCurrency(overview.totalRevenue),
      color: '#10B981'
    }
  ]), [overview.totalCourses, overview.totalEnrollments, overview.totalRevenue]);

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>

          <div className="navbar-dashboard-center">
            <h1>Dashboard</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/Dashboard</span>
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
        <SidebarF />

        <main className="formateur-main">
          <ProfilSection
            formateur={{
              avatar: profile?.profilePicture || 'https://via.placeholder.com/60',
              name: profile?.fullName || 'Instructor'
            }}
          />

          {error && <div className="alert alert-error">{error}</div>}

          <div className="stats-grid">
            {cards.map((card) => (
              <div key={card.label} className="stat-card" style={{ borderLeftColor: card.color }}>
                <div className="stat-icon" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div className="stat-info">
                  <p className="stat-label">{card.label}</p>
                  <h2 className="stat-value">{loading ? '...' : card.value}</h2>
                </div>
              </div>
            ))}
          </div>

          <div className="earnings-section">
            <div className="dashboard-summary-grid">
              <div className="dashboard-summary-card">
                <span>Published Courses</span>
                <strong>{overview.publishedCourses || 0}</strong>
              </div>
              <div className="dashboard-summary-card">
                <span>Pending Review</span>
                <strong>{overview.pendingCourses || 0}</strong>
              </div>
              <div className="dashboard-summary-card">
                <span>Average Rating</span>
                <strong>{overview.averageRating || 0}</strong>
              </div>
              <div className="dashboard-summary-card">
                <span>Total Reviews</span>
                <strong>{overview.totalReviews || 0}</strong>
              </div>
            </div>
            <EarningsChart />
          </div>

          <div className="courses-section">
            <h2>Top Performing Courses</h2>
            <div className="courses-table">
              <div className="table-header">
                <div className="col-title">Course</div>
                <div className="col-students">Students</div>
                <div className="col-status">Status</div>
              </div>
              {topCourses.length === 0 ? (
                <div className="table-row">
                  <div className="col-title">No courses available yet.</div>
                  <div className="col-students">0</div>
                  <div className="col-status"><span className="status-badge">Empty</span></div>
                </div>
              ) : topCourses.map((course) => (
                <div key={course._id} className="table-row">
                  <div className="col-title">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/80'}
                      alt={course.title}
                      className="course-thumbnail"
                    />
                    <span>{course.title}</span>
                  </div>
                  <div className="col-students">{course.totalEnrollments || 0}</div>
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

export default FormateurDashboard;
