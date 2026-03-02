import React from 'react';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import { FaDollarSign, FaStar, FaUsers } from 'react-icons/fa';

const FormateurEarnings = () => {
  const stats = [
    { icon: <FaDollarSign />, label: 'Revenue', value: '$8420', sub: 'Earning this month', color: '#10B981' },
    { icon: <FaStar />, label: 'Course Ratings', value: '4.8', sub: 'Rating from students', color: '#FFB020' },
    { icon: <FaUsers />, label: 'Students Enrolled', value: '12000', sub: 'New this month', color: '#4F46E5' },
  ];

  const earnings = [
    { id: 'ORD001', date: '28 Jan 2025', course: 'Information about UI/UX Design Degree', amount: '$160' },
    { id: 'ORD002', date: '28 Jan 2025', course: 'Wordpress for Beginners - Master Wordpress Quickly', amount: '$190' },
    { id: 'ORD003', date: '17 Jan 2025', course: 'Sketch from A to Z (2024): Become an app designer', amount: '$200' },
    { id: 'ORD004', date: '09 Jan 2025', course: 'Learn Angular Fundamental From beginning to advance', amount: '$170' },
    { id: 'ORD005', date: '03 Jan 2025', course: 'C# Developers Double Your Coding Speed', amount: '$120' },
  ];

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>
          <div className="navbar-dashboard-center">
            <h1>Earnings</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/ Earnings</span>
          </div>
          <div className="navbar-dashboard-right" />
        </div>
      </nav>

      <div className="formateur-container">
        <SidebarF />
        <main className="formateur-main">
          <ProfilSection formateur={{ name: 'Elnhouat chaima', avatar: 'https://via.placeholder.com/80' }} />

          <div className="earnings-section">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Earnings</h2>
            </div>

            <div className="stats-grid">
              {stats.map((s, i) => (
                <div key={i} className="stat-card" style={{ borderLeftColor: s.color }}>
                  <div className="stat-icon" style={{ color: s.color, fontSize: '1.8rem' }}>{s.icon}</div>
                  <div className="stat-info">
                    <p className="stat-label">{s.label}</p>
                    <h3 className="stat-value">{s.value}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Orders</h3>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>01 Jan 2025 - 31 Jan 2025</div>
              </div>

              <div className="courses-table" style={{ background: '#fff', borderRadius: 8, padding: '1rem' }}>
                <div className="table-header" style={{ display: 'flex', fontWeight: 700, padding: '0.75rem 1rem', borderBottom: '1px solid #eef2f7' }}>
                  <div style={{ flex: 1 }}>Order ID</div>
                  <div style={{ width: 140 }}>Date</div>
                  <div style={{ flex: 3 }}>Course</div>
                  <div style={{ width: 100, textAlign: 'right' }}>Amount</div>
                </div>
                {earnings.map((row) => (
                  <div key={row.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ flex: 1 }}>{row.id}</div>
                    <div style={{ width: 140 }}>{row.date}</div>
                    <div style={{ flex: 3 }}>{row.course}</div>
                    <div style={{ width: 100, textAlign: 'right' }}>{row.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormateurEarnings;
