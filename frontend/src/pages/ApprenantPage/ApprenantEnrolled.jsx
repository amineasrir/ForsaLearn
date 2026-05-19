import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import { FaBook, FaClock } from 'react-icons/fa';
import { getApprenantProfile, getEnrolledCourses } from '../../services/apprenentService';
import { getMediaUrl } from '../../utils/mediaUrl';
import { getUserAvatar } from '../../utils/userAvatar';
import './apprenant.css';

const getStatusInfo = (progress) => {
  const p = Number(progress || 0);
  if (p >= 100) return { label: 'Completed', cls: 'status-completed' };
  if (p > 0) return { label: 'Inprogress', cls: 'status-inprogress' };
  return { label: 'Not Started', cls: 'status-notstarted' };
};

const ApprenantEnrolled = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('enrolled');
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesResponse, userResponse] = await Promise.all([
          getEnrolledCourses(),
          getApprenantProfile()
        ]);
        setCourses(coursesResponse.data?.data || []);
        setUser(userResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || t('errorOccurred'));
      }
    };
    loadData();
  }, []);

  const filteredCourses = useMemo(() => {
    if (tab === 'active') return courses.filter(c => Number(c.myProgress||0) > 0 && Number(c.myProgress||0) < 100);
    if (tab === 'completed') return courses.filter(c => Number(c.myProgress||0) >= 100);
    if (tab === 'notstarted') return courses.filter(c => Number(c.myProgress||0) === 0);
    return courses;
  }, [courses, tab]);

  const counts = {
    enrolled: courses.length,
    active: courses.filter(c => Number(c.myProgress||0) > 0 && Number(c.myProgress||0) < 100).length,
    completed: courses.filter(c => Number(c.myProgress||0) >= 100).length,
    notstarted: courses.filter(c => Number(c.myProgress||0) === 0).length,
  };

  const navigate = useNavigate();

  return (
    <ApprenantLayout>

      {error && <div className="error-message">{error}</div>}

      <section className="enrolled-courses">
        <div className="courses-header-row">
          <h2>{t('apprenant.enrolledCourses')}</h2>
          <div className="courses-tabs">
            <button className={tab === 'enrolled' ? 'active' : ''} onClick={() => setTab('enrolled')}>
              All Courses ({counts.enrolled})
            </button>
            <button className={tab === 'notstarted' ? 'active' : ''} onClick={() => setTab('notstarted')}>
              Not Started ({counts.notstarted})
            </button>
            <button className={tab === 'active' ? 'active' : ''} onClick={() => setTab('active')}>
              Inprogress ({counts.active})
            </button>
            <button className={tab === 'completed' ? 'active' : ''} onClick={() => setTab('completed')}>
              Completed ({counts.completed})
            </button>
          </div>
        </div>

        <div className="courses-container">
          {filteredCourses.map(course => {
            const progress = Number(course.myProgress || 0);
            const { label, cls } = getStatusInfo(progress);
            const totalLessons = course.totalLessons || course.chapters?.length || 0;
            const doneLessons = Math.round((progress / 100) * totalLessons);
            const duration = course.duration || course.totalDuration || 0;

            return (
              <div key={course._id} className="ec-card">
                <div className="ec-card__thumb">
                  <img
                    src={getMediaUrl(course.thumbnail) || require('../../assets/image/cours/cours1.jpg')}
                    alt={course.title}
                  />
                  <span className={`ec-status-badge ${cls}`}>{label}</span>
                </div>

                <div className="ec-card__body">
                  <div className="ec-card__meta">
                    <img
                      src={getUserAvatar(course.formateur)}
                      alt={course.formateur?.fullName}
                      className="ec-card__avatar"
                    />
                    <span className="ec-card__instructor">{course.formateur?.fullName || t('instructor')}</span>
                    <span className="ec-card__category">{course.category}</span>
                  </div>

                  <h3 className="ec-card__title">{course.title}</h3>

                  <div className="ec-card__stats">
                    {totalLessons > 0 && (
                      <span className="ec-stat"><FaBook /> {doneLessons}/{totalLessons} Lesson</span>
                    )}
                    {duration > 0 && (
                      <span className="ec-stat"><FaClock /> {duration}h</span>
                    )}
                  </div>

                  <div className="ec-card__progress-row">
                    <span className="ec-card__progress-label">Progress</span>
                    <div className="ec-card__progress-bar">
                      <div
                        className={`ec-card__progress-fill ${cls}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="ec-card__progress-pct">{progress}%</span>
                  </div>

                  <button className="ec-card__btn" onClick={() => navigate(`/apprenant/course/${course._id}/learn`)}>
                    <span className="ec-card__btn-icon">▶</span>
                    Start Learning
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </ApprenantLayout>
  );
};

export default ApprenantEnrolled;
