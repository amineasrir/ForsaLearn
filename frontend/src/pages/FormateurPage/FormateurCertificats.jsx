import React, { useEffect, useState } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import { useTranslation } from 'react-i18next';
import { FaDownload, FaEye } from 'react-icons/fa';
import i18nInstance from '../../i18n';
import {
  getFormateurCertificates,
  getFormateurProfile
} from '../../services/formateurService';

const FormateurCertificats = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState('');

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
          <div className="navbar-dashboard-right">
            <button className="lang-btn-dashboard" onClick={changeLanguage}>
              <span className={getFlagClass(currentLang)} style={{ fontSize: '20px' }}></span>
              <span>{currentLang.toUpperCase()}</span>
            </button>
          </div>        </div>
      </nav>

      <div className="formateur-container">
        <SidebarF />
        <main className="formateur-main">
        
          {error && <div className="alert alert-error">{error}</div>}

          <div className="certificate-section">
            <h2>{t('formateur.certificates.title')}</h2>
            <p>{t('formateur.certificates.description')}</p>

            <div className="certificate-table">
              <div className="certificate-table-header formateur-cert-header">
                <div>{t('formateur.certificates.certificateId')}</div>
                <div>{t('formateur.certificates.student')}</div>
                <div>{t('formateur.certificates.course')}</div>
                <div>{t('formateur.certificates.date')}</div>
                <div className="certificate-actions text-right">{t('formateur.certificates.actions')}</div>
              </div>
              {certificates.length === 0 ? (
                <div className="formateur-cert-row certificate-row no-certificates">
                  <div>{t('formateur.certificates.noCertificatesYet')}</div>
                  <div>-</div>
                  <div>-</div>
                  <div>-</div>
                  <div className="certificate-actions text-right">-</div>
                </div>
              ) : certificates.map((certificate) => (
                <div key={certificate._id} className="formateur-cert-row certificate-row">
                  <div>{certificate.certificateId}</div>
                  <div>{certificate.student?.fullName || certificate.studentName}</div>
                  <div>{certificate.course?.title || certificate.courseName}</div>
                  <div>{certificate.completionDate ? new Date(certificate.completionDate).toLocaleDateString() : '-'}</div>
                  <div className="certificate-actions text-right">
                    <button type="button" className="certificate-action-btn" onClick={() => handleViewCertificate(certificate)}>
                      <FaEye />
                      <span>{t('formateur.certificates.view')}</span>
                    </button>
                    <button type="button" className="certificate-action-btn" onClick={() => handleDownloadCertificate(certificate)}>
                      <FaDownload />
                      <span>{t('formateur.certificates.download')}</span>
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
