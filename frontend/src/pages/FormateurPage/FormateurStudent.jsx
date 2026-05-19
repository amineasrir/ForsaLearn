import React, { useEffect, useMemo, useState } from 'react';
import SidebarF from '../../components/formateur/sidebarF';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import { getMediaUrl } from '../../utils/mediaUrl';
import {
  getFormateurProfile,
  getFormateurStudents
} from '../../services/formateurService';

const FormateurStudent = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const [profileResponse, studentsResponse] = await Promise.all([
          getFormateurProfile(),
          getFormateurStudents()
        ]);

        setProfile(profileResponse.data?.data || null);
        setStudents(studentsResponse.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load students.');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
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

  const filteredStudents = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return students;

    return students.filter((entry) => {
      const name = entry.student?.fullName || '';
      const email = entry.student?.email || '';
      return `${name} ${email}`.toLowerCase().includes(normalized);
    });
  }, [searchTerm, students]);

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
          </div>
        </div>
      </nav>

      <div className="formateur-container">
        <SidebarF />

        <main className="formateur-main">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="students-toolbar">
            <input
              type="text"
              placeholder={t('formateur.students.searchPlaceholder')}
              className="search-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="students-grid">
            {loading ? (
              <div className="student-card">
                <h3>{t('formateur.students.loading')}</h3>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="student-card">
                <h3>{t('formateur.students.noStudentsFound')}</h3>
                <p className="join-date">{t('formateur.students.noStudentsDescription')}</p>
              </div>
            ) : filteredStudents.map((entry) => (
              <div key={entry.student?._id} className="student-card">
                <img
                  src={getMediaUrl(entry.student?.profilePicture) || 'https://via.placeholder.com/120'}
                  alt={entry.student?.fullName || 'Student'}
                  
                />
                <div className="student-role">{t('formateur.students.activeStudent')}</div>
                <h3>{entry.student?.fullName || t('formateur.students.unknownStudent')}</h3>
                <p className="join-date">
                  {t('formateur.students.joinedOn')} {entry.enrolledAt ? new Date(entry.enrolledAt).toLocaleDateString() : 'N/A'}
                </p>
                <p>{entry.student?.email || t('formateur.students.noEmailAvailable')}</p>
                <div className="courses-info">
                  {entry.coursesEnrolled?.length || 0} {t('formateur.students.courses')} • {entry.averageProgress || 0}% {t('formateur.students.avgProgress')}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormateurStudent;
