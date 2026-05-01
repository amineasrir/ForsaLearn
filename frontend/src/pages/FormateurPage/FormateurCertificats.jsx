import React, { useEffect, useState } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import { FaDownload, FaEye } from 'react-icons/fa';
import {
  getFormateurCertificates,
  getFormateurProfile
} from '../../services/formateurService';

const FormateurCertificats = () => {
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const [profileResponse, certificatesResponse] = await Promise.all([
          getFormateurProfile(),
          getFormateurCertificates()
        ]);

        setProfile(profileResponse.data?.data || null);
        setCertificates(certificatesResponse.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load certificates.');
      }
    };

    loadCertificates();
  }, []);

  const handleViewCertificate = (certificate) => {
    if (certificate?.pdfUrl) {
      window.open(`http://localhost:5000${certificate.pdfUrl}`, '_blank');
    }
  };

  const handleDownloadCertificate = async (certificate) => {
    if (!certificate?.certificateId) return;

    window.open(`http://localhost:5000/api/certificate/download/${certificate.certificateId}`, '_blank');
  };

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
          <ProfilSection
            formateur={{
              name: profile?.fullName || 'Instructor',
              avatar: profile?.profilePicture || 'https://via.placeholder.com/80'
            }}
            actionLabel="View Earnings"
          />

          {error && <div className="alert alert-error">{error}</div>}

          <div className="profile-details">
            <h2>All Issued Certificates</h2>
            <p>Below is the list of certificates issued for your courses. You can view or download each certificate.</p>

            <div className="courses-table" style={{ marginTop: '1rem' }}>
              <div className="table-header formateur-cert-header" style={{ fontWeight: 700, padding: '0.75rem 1rem', borderBottom: '1px solid #eef2f7' }}>
                <div>Certificate ID</div>
                <div>Student</div>
                <div>Course</div>
                <div>Date</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>
              {certificates.length === 0 ? (
                <div className="table-row formateur-cert-row" style={{ alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div>No certificates yet</div>
                  <div>-</div>
                  <div>-</div>
                  <div>-</div>
                  <div style={{ textAlign: 'right' }}>-</div>
                </div>
              ) : certificates.map((certificate) => (
                <div key={certificate._id} className="table-row formateur-cert-row" style={{ alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div>{certificate.certificateId}</div>
                  <div>{certificate.student?.fullName || certificate.studentName}</div>
                  <div>{certificate.course?.title || certificate.courseName}</div>
                  <div>{certificate.completionDate ? new Date(certificate.completionDate).toLocaleDateString() : '-'}</div>
                  <div style={{ textAlign: 'right' }}>
                    <button className="menu-item" style={{ marginRight: 8 }} onClick={() => handleViewCertificate(certificate)}>
                      <FaEye />
                      <span style={{ marginLeft: 8 }}>View</span>
                    </button>
                    <button className="menu-item" onClick={() => handleDownloadCertificate(certificate)}>
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
