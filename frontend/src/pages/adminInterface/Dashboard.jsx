import React, { useState } from "react";
import logo from "../../assets/image/home_page/logo_rem.png";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18nInstance from "../../i18n";
import 'flag-icons/css/flag-icons.min.css'; // Import CSS des drapeaux
import "../../styles/dashboard.css";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const lang = (i18n && i18n.language === "en") ? "fr" : "en";
    const instance = (i18n && typeof i18n.changeLanguage === "function") ? i18n : i18nInstance;
    if (instance && typeof instance.changeLanguage === "function") {
      instance.changeLanguage(lang);
    } else {
      console.warn("i18n.changeLanguage is not available");
    }
  };


  const studentGrowthData = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 35 },
    { month: "Mar", value: 45 },
    { month: "Apr", value: 55 },
    { month: "May", value: 70 },
    { month: "Jun", value: 85 },
    { month: "Jul", value: 95 },
    { month: "Aug", value: 105 },
    { month: "Sep", value: 110 },
    { month: "Oct", value: 110 },
    { month: "Nov", value: 115 },
    { month: "Dec", value: 120 },
  ];

  const maxValue = 120;

  
  // Fonction pour obtenir le code du drapeau
  const getFlagClass = (lang) => {
    switch (lang) {
      case "en":
        return "fi fi-gb"; // Royaume-Uni pour anglais
      case "fr":
        return "fi fi-fr"; // France pour français
      default:
        return "fi fi-gl"; // globe par défaut
    }
  };

  // Ensure we have a valid language string before calling string methods
  const currentLang = (i18n && i18n.language) ? i18n.language : "en";


  return (
    <div className="dashboard">

      {/* Hero Section */}
      <div className="hero">
        <div className="container">
        <div className="logo">
              <img src={logo} alt="ForsaLearn Logo" className="logo-icon" />
            </div>

          <h1 className="hero-title">Dashboard</h1>
          <div className="nav-actions">
              <button
                className="lang-btn"
                onClick={changeLanguage}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  className={getFlagClass(currentLang)}
                  style={{ fontSize: "18px" }}
                ></span>
                <span>{currentLang.toUpperCase()}</span>
              </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container main-content">
        <div className="content-wrapper">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Main Menu</h3>
              <nav className="sidebar-nav">
                <NavLink to="#" className="sidebar-link active">
                  <span className="sidebar-icon">📊</span>
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                  <span className="sidebar-icon">👤</span>
                  <span>My Profile</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                  <span className="sidebar-icon">📚</span>
                  <span>Courses</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                  <span className="sidebar-icon">👨‍🏫</span>
                  <span>Instructors</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                  <span className="sidebar-icon">👥</span>
                  <span>Students</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                  <span className="sidebar-icon">🎫</span>
                  <span>Support Tickets</span>
                </NavLink>
              </nav>

              <h3 className="sidebar-title">Account Settings</h3>
              <nav className="sidebar-nav">
                <NavLink to="#" className="sidebar-link">
                  <span className="sidebar-icon">⚙️</span>
                  <span>Settings</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                  <span className="sidebar-icon">🚪</span>
                  <span>Logout</span>
                </NavLink>
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="main">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-content">
                <div className="profile-avatar-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                    alt="Elrhouat chaima"
                    className="profile-avatar"
                  />
                  <span className="profile-status"></span>
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">Elrhouat chaima ✓</h2>
                  <p className="profile-role">Administrateur</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total instructor</span>
                  <div className="stat-icon purple">👨‍🏫</div>
                </div>
                <p className="stat-value">13</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Active Courses</span>
                  <div className="stat-icon pink">📖</div>
                </div>
                <p className="stat-value">08</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Students</span>
                  <div className="stat-icon purple">👥</div>
                </div>
                <p className="stat-value">17</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Courses</span>
                  <div className="stat-icon cyan">📚</div>
                </div>
                <p className="stat-value">11</p>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="stat-card earnings-card">
              <div className="stat-header">
                <span className="stat-label">Total Earnings</span>
                <div className="stat-icon purple-gradient">💰</div>
              </div>
              <p className="stat-value">$486</p>
            </div>

            {/* Students Growth Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Students Growth</h3>
                <button className="year-selector">
                  <span>📅</span>
                  <span>{selectedYear}</span>
                </button>
              </div>

              <div className="chart-container">
                <div className="chart-y-axis">
                  <span>120</span>
                  <span>100</span>
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>-</span>
                </div>

                <div className="chart-area">
                  {studentGrowthData.map((data, index) => (
                    <div key={data.month} className="chart-bar-wrapper">
                      <div
                        className="chart-bar"
                        style={{ height: `${(data.value / maxValue) * 100}%` }}
                      ></div>
                      <span className="chart-label">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
 
    </div>
  );
};

export default Dashboard;
