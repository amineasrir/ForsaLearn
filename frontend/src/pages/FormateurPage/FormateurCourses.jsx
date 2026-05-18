import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import SidebarF from '../../components/formateur/sidebarF';
import {
  archiveFormateurCourse,
  deleteFormateurCourse,
  getFormateurCourses,
  getFormateurProfile
} from '../../services/formateurService';
import { getMediaUrl } from '../../utils/mediaUrl';

const labelToStatus = {
  Published: 'published',
  Pending: 'pending',
  Draft: 'draft',
  Archived: 'archived',
  Rejected: 'rejected',
  All: 'all'
};

const FormateurCourses = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Published');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCourses = async (status) => {
    try {
      setLoading(true);
      const params = {};
      const normalizedStatus = labelToStatus[status];
      if (normalizedStatus && normalizedStatus !== 'all') {
        params.status = normalizedStatus;
      }

      const response = await getFormateurCourses(params);
      setCourses(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const profileResponse = await getFormateurProfile();
        setProfile(profileResponse.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    loadCourses(statusFilter);
  }, [statusFilter]);

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

  const counts = useMemo(() => {
    const summary = {
      Published: 0,
      Pending: 0,
      Draft: 0,
      Archived: 0,
      Rejected: 0
    };

    courses.forEach((course) => {
      const label = Object.keys(labelToStatus).find((key) => labelToStatus[key] === course.status);
      if (label && summary[label] !== undefined) {
        summary[label] += 1;
      }
    });

    return summary;
  }, [courses]);

  const statusOptions = [
    { label: t('formateur.courses.published'), key: 'Published' },
    { label: t('formateur.courses.pending'), key: 'Pending' },
    { label: t('formateur.courses.draft'), key: 'Draft' },
    { label: t('formateur.courses.archived'), key: 'Archived' },
    { label: t('formateur.courses.rejected'), key: 'Rejected' },
    { label: t('formateur.courses.all'), key: 'All' }
  ];

  const handleArchive = async (courseId) => {
    try {
      await archiveFormateurCourse(courseId);
      loadCourses(statusFilter);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course status.');
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await deleteFormateurCourse(courseId);
      loadCourses(statusFilter);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course.');
    }
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
          </div>
        </div>
      </nav>

      <div className="formateur-container">
        <SidebarF />

        <main className="formateur-main">

          {error && <div className="alert alert-error">{error}</div>}

          <div className="status-filters">
            {statusOptions.map((opt) => (
              <button
                key={opt.key}
                className={statusFilter === opt.key ? 'active' : ''}
                onClick={() => setStatusFilter(opt.key)}
              >
                {opt.label} {opt.key !== 'All' ? `(${counts[opt.key] || 0})` : `(${courses.length})`}
              </button>
            ))}
          </div>

          <div className="courses-section">
            <div className="courses-table">
              <div className="table-header formateur-courses-header">
                <div className="col-title">{t('formateur.courses.course')}</div>
                <div className="col-students">{t('formateur.courses.students')}</div>
                <div className="col-status">{t('formateur.courses.status')}</div>
                <div className="col-actions">{t('formateur.courses.actions')}</div>
              </div>
              {loading ? (
                <div className="table-row formateur-courses-row">
                  <div className="col-title">{t('formateur.courses.loading')}</div>
                  <div className="col-students">...</div>
                  <div className="col-status">...</div>
                  <div className="col-actions">...</div>
                </div>
              ) : courses.length === 0 ? (
                <div className="table-row formateur-courses-row">
                  <div className="col-title">{t('formateur.courses.noCoursesFound')}</div>
                  <div className="col-students">0</div>
                  <div className="col-status">-</div>
                  <div className="col-actions">-</div>
                </div>
              ) : courses.map((course) => (
                <div key={course._id} className="table-row formateur-courses-row">
                  <div className="col-title">
                    <img
                      src={getMediaUrl(course.thumbnail) || 'https://via.placeholder.com/120x80'}
                      alt={course.title}
                      className="course-thumbnail"
                    />
                    <div className="course-title-stack">
                      <span>{course.title}</span>
                      <small>{course.category} • {course.level}</small>
                    </div>
                  </div>
                  <div className="col-students">{course.totalEnrollments || 0}</div>
                  <div className="col-status">
                    <span className="status-badge">{course.status}</span>
                  </div>
                  <div className="col-actions">
                    <button className="mini-action-btn" onClick={() => navigate(`/formateur/edit-course/${course._id}`)}>
                      {t('formateur.courses.edit')}
                    </button>
                    <button className="mini-action-btn" onClick={() => handleArchive(course._id)}>
                      {course.status === 'archived' ? t('formateur.courses.unarchive') : t('formateur.courses.archive')}
                    </button>
                    <button className="mini-action-btn danger" onClick={() => handleDelete(course._id)}>
                      {t('formateur.courses.delete')}
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

export default FormateurCourses;
