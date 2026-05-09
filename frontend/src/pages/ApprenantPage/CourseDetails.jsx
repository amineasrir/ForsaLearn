import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaStar, FaClock, FaUsers, FaBookOpen, FaPlayCircle, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import { getCourseDetails, enrollInCourse } from '../../services/apprenentService';
import './CourseDetails.css';

const CourseDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const response = await getCourseDetails(id);
        setCourse(response.data?.data);
      } catch (err) {
        setError(err.response?.data?.message || t('errorOccurred'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourse();
    }
  }, [id, t]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setError('');
      await enrollInCourse(id);
      setSuccess(t('apprenant.enrolledSuccessfully'));
      // Update course enrollment count
      setCourse(prev => ({
        ...prev,
        totalEnrollments: (prev.totalEnrollments || 0) + 1
      }));
    } catch (err) {
      setError(err.response?.data?.message || t('errorOccurred'));
    } finally {
      setEnrolling(false);
    }
  };

  const formatDuration = (minutes = 0) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <ApprenantLayout
        title={t('apprenant.courseDetails')}
        breadcrumb={[{ to: '/', label: t('home') }, { to: '/courses', label: t('apprenant.courses') }, { label: t('apprenant.loading') }]}
      >
        <div className="loading-spinner">Loading...</div>
      </ApprenantLayout>
    );
  }

  if (!course) {
    return (
      <ApprenantLayout
        title={t('apprenant.courseDetails')}
        breadcrumb={[{ to: '/', label: t('home') }, { to: '/courses', label: t('apprenant.courses') }, { label: t('apprenant.notFound') }]}
      >
        <div className="error-message">{t('apprenant.courseNotFound')}</div>
      </ApprenantLayout>
    );
  }

  const rightContent = (
    <>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <ApprenantLayout
      title={course.title}
      breadcrumb={[{ to: '/', label: t('home') }, { to: '/courses', label: t('apprenant.courses') }, { label: course.title }]}
      rightContent={rightContent}
      className="course-details-container"
    >
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="course-details-header">
        <button className="back-button" onClick={() => navigate('/courses')}>
          <FaArrowLeft /> {t('apprenant.backToCourses')}
        </button>
      </div>

      <div className="course-details-content">
        <div className="course-main-info">
          <div className="course-thumbnail">
            <img src={course.thumbnail || require('../../assets/image/cours/cours.jpg')} alt={course.title} />
            <div className="play-overlay">
              <FaPlayCircle />
            </div>
          </div>

          <div className="course-info">
            <h1>{course.title}</h1>
            <p className="course-description">{course.description}</p>

            <div className="course-meta">
              <div className="meta-item">
                <FaUsers />
                <span>{course.totalEnrollments || 0} {t('apprenant.students')}</span>
              </div>
              <div className="meta-item">
                <FaStar />
                <span>{Number(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0} {t('apprenant.reviews')})</span>
              </div>
              <div className="meta-item">
                <FaClock />
                <span>{formatDuration(course.totalDuration || 0)}</span>
              </div>
              <div className="meta-item">
                <FaBookOpen />
                <span>{course.sections?.length || 0} {t('apprenant.sections')}</span>
              </div>
            </div>

            <div className="course-instructor">
              <h3>{t('apprenant.instructor')}: {course.formateur?.fullName || t('apprenant.unknownInstructor')}</h3>
              {course.formateur?.bio && <p>{course.formateur.bio}</p>}
            </div>

            <div className="course-price-section">
              {course.priceType === 'free' ? (
                <div className="price-free">
                  <span className="price-label">{t('apprenant.free')}</span>
                </div>
              ) : (
                <div className="price-paid">
                  <span className="price-current">${Number(course.price || 0).toFixed(2)}</span>
                  {course.discount?.percentage > 0 && (
                    <span className="price-original">${Number(course.price).toFixed(2)}</span>
                  )}
                </div>
              )}

              <button
                className="enroll-button"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? t('apprenant.enrolling') : t('apprenant.enrollNow')}
              </button>
            </div>
          </div>
        </div>

        <div className="course-details-sections">
          <h2>{t('apprenant.courseContent')}</h2>
          {course.sections && course.sections.length > 0 ? (
            <div className="sections-list">
              {course.sections.map((section, index) => (
                <div key={section._id || index} className="section-item">
                  <div className="section-header">
                    <h4>{section.title}</h4>
                    <span className="section-duration">{formatDuration(section.duration)}</span>
                  </div>
                  {section.description && <p>{section.description}</p>}
                  {section.lessons && section.lessons.length > 0 && (
                    <div className="lessons-list">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson._id || lessonIndex} className="lesson-item">
                          <FaCheckCircle />
                          <span>{lesson.title}</span>
                          <span className="lesson-duration">{formatDuration(lesson.duration)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>{t('apprenant.noContentAvailable')}</p>
          )}

          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="learning-outcomes">
              <h3>{t('apprenant.whatYouWillLearn')}</h3>
              <ul>
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index}>
                    <FaCheckCircle />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.requirements && course.requirements.length > 0 && (
            <div className="course-requirements">
              <h3>{t('apprenant.requirements')}</h3>
              <ul>
                {course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </ApprenantLayout>
  );
};

export default CourseDetails;