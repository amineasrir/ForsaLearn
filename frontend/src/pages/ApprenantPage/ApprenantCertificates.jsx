import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaDownload } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import {
  getApprenantProfile,
  getCertificateDownloadUrl,
  getMyCertificates
} from '../../services/apprenentService';
  import './apprenant.css';

const ApprenantCertificates = () => {
  const { t } = useTranslation();
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
        setError(err.response?.data?.message || t('errorOccurred'));
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
      <div className="notification-icon"></div>
    </>
  );

  return (
    <ApprenantLayout>

          {error && <div className="error-message">{error}</div>}
          <section className="certificates-section">
            <h2>{t('apprenant.myCertificates')}</h2>
            <div className="certificates-table-container" style={{marginTop:"20px"}}>
              <table className="certificates-table">
                <thead>
                  <tr>
                    <th>{t('apprenant.certificateId')}</th>
                    <th>{t('apprenant.courseName')}</th>
                    <th>{t('apprenant.date')}</th>
                    <th>{t('apprenant.instructor')}</th>
                    <th>{t('apprenant.status')}</th>
                    <th>{t('apprenant.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map(cert => (
                    <tr key={cert._id}>
                      <td>{cert.certificateId}</td>
                      <td>{cert.course?.title || cert.courseName}</td>
                      <td>{cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : t('apprenant.na')}</td>
                      <td>{cert.instructor?.fullName || cert.instructorName}</td>
                      <td>{cert.status || t('apprenant.active')}</td>
                      <td>
                        <FaEye
                          title={t('apprenant.view')}
                          style={{cursor: 'pointer', marginRight: '0.5rem'}}
                          onClick={() => handleViewCertificate(cert)}
                        />
                        <FaDownload
                          title={t('apprenant.download')}
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
      </ApprenantLayout>
  );
};

export default ApprenantCertificates;
