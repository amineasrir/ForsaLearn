import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import { FaStar } from 'react-icons/fa';
import { getApprenantProfile, getEnrolledCourses } from '../../services/apprenentService';
import './dashboard.css';

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
    if (tab === 'active') {
      return courses.filter((course) => Number(course.myProgress || 0) > 0 && Number(course.myProgress || 0) < 100);
    }
    if (tab === 'completed') {
      return courses.filter((course) => Number(course.myProgress || 0) >= 100);
    }
    return courses;
  }, [courses, tab]);

  const counts = {
    enrolled: courses.length,
    active: courses.filter((course) => Number(course.myProgress || 0) > 0 && Number(course.myProgress || 0) < 100).length,
    completed: courses.filter((course) => Number(course.myProgress || 0) >= 100).length
  };

  const rightContent = (
    <>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <ApprenantLayout
      title={t('apprenant.enrolledCourses')}
      breadcrumb={[{ to: '/', label: t('home') }, { label: t('apprenant.enrolledCourses') }]}
      rightContent={rightContent}
    >
      <CardP user={user} />

          {error && <div className="error-message">{error}</div>}
          <section className="enrolled-courses">
            <div className="courses-header-row">
              <h2>{t('apprenant.enrolledCourses')}</h2>
              <div className="courses-tabs">
                <button
                  className={tab === 'enrolled' ? 'active' : ''}
                  onClick={() => setTab('enrolled')}
                >
                  {t('apprenant.enrolled')} ({counts.enrolled})
                </button>
                <button
                  className={tab === 'active' ? 'active' : ''}
                  onClick={() => setTab('active')}
                >
                  {t('apprenant.active')} ({counts.active})
                </button>
                <button
                  className={tab === 'completed' ? 'active' : ''}
                  onClick={() => setTab('completed')}
                >
                  {t('apprenant.completed')} ({counts.completed})
                </button>
              </div>
            </div>

            <div className="courses-container">
              {filteredCourses.map(course => (
                <div key={course._id} className="course-card">
                  <img
                    src={course.thumbnail || require('../../assets/image/cours/cours1.jpg')}
                    alt={course.title}
                    className="course-image"
                  />
                  <div className="course-info">
                    <p className="course-category">{course.category}</p>
                    <h3>{course.title}</h3>
                    <p className="instructor">{course.formateur?.fullName || t('instructor')}</p>
                    <div className="course-footer">
                      <div className="rating">
                        <FaStar className="star" />
                        <span>
                          {Number(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0} Reviews)
                        </span>
                      </div>
                    </div>
                    <div className="course-action">
                      <span className="price">{course.priceType === 'free' ? t('apprenant.priceFree') : `$${Number(course.price || 0).toFixed(2)}`}</span>
                      <button className="view-course-btn">
                        {Number(course.myProgress || 0) >= 100 && course.certificateIssued
                          ? t('apprenant.certificateEarned')
                          : t('apprenant.progress', { value: course.myProgress || 0 })}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
      </ApprenantLayout>
  );
};

export default ApprenantEnrolled;
