import React, { useEffect, useState } from 'react';
import { FaEye, FaDownload } from 'react-icons/fa';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import DashboardNavbar from '../../components/common/DashboardNavbar';
import {
  getApprenantProfile,
  getCertificateDownloadUrl,
  getMyCertificates
} from '../../services/apprenentService';
import './dashboard.css';

const ApprenantCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [certificatesResponse, userResponse] = await Promise.all([
          getMyCertificates(),
          getApprenantProfile()
        ]);

        setCertificates(certificatesResponse.data?.data || []);
        setUser(userResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load certificates.');
      }
    };

    loadData();
  }, []);

  const handleViewCertificate = (certificate) => {
    if (!certificate?.pdfUrl) return;
    window.open(`http://localhost:5000${certificate.pdfUrl}`, '_blank');
  };

  const handleDownloadCertificate = async (certificate) => {
    if (!certificate?.certificateId) return;

    try {
      const response = await getCertificateDownloadUrl(certificate.certificateId);
      const downloadUrl = response.data?.downloadUrl;
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download certificate.');
    }
  };

  const rightContent = (
    <>
      <button className="lang-btn">ENG</button>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <div className="apprenant-dashboard">
      <DashboardNavbar
        title="My Certificates"
        breadcrumb={[{ to: '/', label: 'Home' }, { label: 'My Certificates' }]}
        rightContent={rightContent}
      />


      <div className="dashboard-container">
        <Sidebar />

        <main className="main-content">
      <CardP user={user} />

          {error && <div className="error-message">{error}</div>}
          <section className="certificates-section">
            <h2>My Certificates</h2>
            <div className="certificates-table-container" style={{marginTop:"20px"}}>
              <table className="certificates-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course Name</th>
                    <th>Date</th>
                    <th>Instructor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map(cert => (
                    <tr key={cert._id}>
                      <td>{cert.certificateId}</td>
                      <td>{cert.course?.title || cert.courseName}</td>
                      <td>{cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : 'N/A'}</td>
                      <td>{cert.instructor?.fullName || cert.instructorName}</td>
                      <td>{cert.status || 'active'}</td>
                      <td>
                        <FaEye
                          title="View"
                          style={{cursor: 'pointer', marginRight: '0.5rem'}}
                          onClick={() => handleViewCertificate(cert)}
                        />
                        <FaDownload
                          title="Download"
                          style={{cursor: 'pointer'}}
                          onClick={() => handleDownloadCertificate(cert)}
                        />
                      </td>
                    </tr>
                  ))}
                  {certificates.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                        No certificates found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ApprenantCertificates;
