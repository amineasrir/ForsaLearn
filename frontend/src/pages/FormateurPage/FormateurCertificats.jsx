import React from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import { FaDownload, FaEye } from 'react-icons/fa';

const FormateurCertificats = () => {
  const certificates = [
    { id: 'CERT001', student: 'Amina Zahra', course: 'UI/UX Design Degree', date: '28 Jan 2025', file: '#' },
    { id: 'CERT002', student: 'Youssef Karim', course: 'Wordpress for Beginners', date: '25 Jan 2025', file: '#' },
    { id: 'CERT003', student: 'Sana B.', course: 'Sketch from A to Z', date: '20 Jan 2025', file: '#' },
  ];

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>
          <div className="navbar-dashboard-center">
            <h1>Certificates</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/ Certificates</span>
          </div>
          <div className="navbar-dashboard-right" />
        </div>
      </nav>

      <div className="formateur-container">
        <SidebarF />
        <main className="formateur-main">
          <ProfilSection formateur={{ name: 'Elnhouat chaima', avatar: 'https://via.placeholder.com/80' }} />

          <div className="profile-details">
            <h2>All Issued Certificates</h2>
            <p>Below is the list of certificates issued for your courses. You can view or download each certificate.</p>

            <div className="courses-table" style={{ marginTop: '1rem' }}>
              <div className="table-header" style={{ display: 'flex', fontWeight: 700, padding: '0.75rem 1rem', borderBottom: '1px solid #eef2f7' }}>
                <div style={{ flex: 1 }}>Certificate ID</div>
                <div style={{ flex: 2 }}>Student</div>
                <div style={{ flex: 3 }}>Course</div>
                <div style={{ width: 140 }}>Date</div>
                <div style={{ width: 140, textAlign: 'right' }}>Actions</div>
              </div>
              {certificates.map(cert => (
                <div key={cert.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ flex: 1 }}>{cert.id}</div>
                  <div style={{ flex: 2 }}>{cert.student}</div>
                  <div style={{ flex: 3 }}>{cert.course}</div>
                  <div style={{ width: 140 }}>{cert.date}</div>
                  <div style={{ width: 140, textAlign: 'right' }}>
                    <button className="menu-item" style={{ marginRight: 8 }} onClick={() => window.open(cert.file, '_blank')}>
                      <FaEye />
                      <span style={{ marginLeft: 8 }}>View</span>
                    </button>
                    <button className="menu-item" onClick={() => alert('Download started')}>
                      <FaDownload />
                      <span style={{ marginLeft: 8 }}>Download</span>
                    </button>
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

export default FormateurCertificats;
